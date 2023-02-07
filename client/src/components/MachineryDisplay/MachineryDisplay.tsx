import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { Machinery } from "../../models/machinery.model";
import ImageGallery from "react-image-gallery";
import { useState } from "react";
import MatIcon from "../MatIcon/MatIcon";
import styles from "./MachineryDisplay.module.scss";

interface MachineryDisplayProps {
  machine: Machinery;
}

const MachineryDisplay = ({ machine }: MachineryDisplayProps) => {
  let color: string = "green";

  const dateDiff = moment(machine.registeredUntil).diff(moment(), "days");

  if (dateDiff < 0) {
    color = "#A63232";
  } else if (dateDiff < 30) {
    color = "orange";
  }

  return (
    <Paper elevation={4} className={`p-2`}>
      <Box className="w-full">
        <Table className="w-full" sx={{ fontSize: "1.6rem" }}>
          <TableBody>
            <TableRow>
              <TableCell variant="head">Kategorija:</TableCell>
              <TableCell>{machine.type ?? "/"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Model:
              </TableCell>
              <TableCell>{machine.model ?? "/"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Registraciona oznaka:
              </TableCell>
              <TableCell>
                {machine.licensePlate == "" ? "/" : machine.licensePlate}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Godina proizvodnje:
              </TableCell>
              <TableCell>{machine.productionYear ?? "/"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" variant="head">
                Registrovan do:
              </TableCell>
              <TableCell>
                <Stack>
                  <Box sx={{ color: color }}>
                    {moment(machine.registeredUntil).format("DD/MM/yyyy")}
                  </Box>
                  {dateDiff < 90 && (
                    <Box
                      className="text-xs"
                      color={dateDiff < 0 ? color : "gray"}
                    >
                      {dateDiff < 0 ? (
                        "Istekla registracija"
                      ) : (
                        <span>
                          Registracija ističe za
                          <span style={{ color: color }}> {dateDiff}</span> dana
                        </span>
                      )}
                    </Box>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box className="p-4 flex justify-center">
          <Box
            sx={{ margin: "auto", maxWidth: { xs: "100vw", md: "40vw" } }}
            className="w-full lg:w-3/5 xl:2/5"
            textAlign="center"
          >
            {machine.images && machine.images.length > 0 && (
              <ImageGallery
                // additionalClass={styles.imageGallery}
                autoPlay={true}
                items={machine.images?.map((i) => {
                  if (typeof i === "string") {
                    return { original: i, thumbnail: i };
                  }
                  return { original: "", thumbnail: "" };
                })}
              ></ImageGallery>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MachineryDisplay;
