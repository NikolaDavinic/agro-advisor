using webapi.Models;
using Microsoft.WindowsAzure.Storage;
using System.Reflection.Metadata.Ecma335;

namespace webapi.Services;

public class FileService
{
    private readonly string _ContainerName = "agro-container";
    private readonly CloudStorageAccount _cloudStorageAccount;
    private readonly ILogger<FileService> _logger;
    private readonly IConfiguration _config;
    public FileService(
        IConfiguration config,
        ILogger<FileService> logger)
    {
        _config = config;
        _logger = logger;
        _cloudStorageAccount = CloudStorageAccount.Parse(_config["ConnectionStrings:BlobStorage"]);
    }

    public async Task<string> SaveFile(IFormFile file)
    {
        string newFileName = new PasswordGenerator.Password(
                includeLowercase: true,
                includeUppercase: true,
                passwordLength: 20,
                includeSpecial: false,
                includeNumeric: true).Next() + "." + file.Name;

        var blobClient = _cloudStorageAccount.CreateCloudBlobClient();
        var blobContainer = blobClient.GetContainerReference(containerName: _ContainerName);

        if (await blobContainer.CreateIfNotExistsAsync())
        {
            await blobContainer.SetPermissionsAsync(new Microsoft.WindowsAzure.Storage.Blob.BlobContainerPermissions
            {
                PublicAccess = Microsoft.WindowsAzure.Storage.Blob.BlobContainerPublicAccessType.Container
            });
        }

        var blobBlock = blobContainer.GetBlockBlobReference(newFileName);
        blobBlock.Properties.ContentType = file.ContentType;

        await blobBlock.UploadFromStreamAsync(file.OpenReadStream());

        return $"{blobClient.BaseUri.AbsoluteUri}{blobContainer.Name}/{newFileName}";
    }

    public bool DeleteFiles(List<string> paths)
    {
        var blobClient = _cloudStorageAccount.CreateCloudBlobClient();
        var blobContainer = blobClient.GetContainerReference(containerName: _ContainerName);

        var allDeleted = true;
        foreach(string file in paths)
        {
            var path = Path.GetFileName(file);

            if (String.IsNullOrEmpty(path))
                continue;

            var res = blobContainer.GetBlockBlobReference(path).DeleteIfExistsAsync().Result;
            allDeleted &= res;
        }

        return allDeleted;
    }

    public async Task<List<string>> SaveFiles(List<IFormFile> files)
    {
        var blobClient = _cloudStorageAccount.CreateCloudBlobClient();
        var blobContainer = blobClient.GetContainerReference(containerName: _ContainerName);

        if (await blobContainer.CreateIfNotExistsAsync())
        {
            await blobContainer.SetPermissionsAsync(new Microsoft.WindowsAzure.Storage.Blob.BlobContainerPermissions
            {
                PublicAccess = Microsoft.WindowsAzure.Storage.Blob.BlobContainerPublicAccessType.Container
            });
        }

        List<string> paths = new();

        foreach(var file in files)
        {
            try
            {
                string newFileName = new PasswordGenerator.Password(
                    includeLowercase: true,
                    includeUppercase: true,
                    passwordLength: 20,
                    includeSpecial: false,
                    includeNumeric: true).Next() + "." + file.FileName;

                var blobBlock = blobContainer.GetBlockBlobReference(newFileName);
                blobBlock.Properties.ContentType = file.ContentType;

                await blobBlock.UploadFromStreamAsync(file.OpenReadStream());

                paths.Add($"{blobClient.BaseUri.AbsoluteUri}{blobContainer.Name}/{newFileName}");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
            }
        }

        return paths;
    }
}