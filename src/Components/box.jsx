import { Box } from "@mui/material"
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import io from 'socket.io-client'
import { useEffect } from "react";


export default function Chatapp() {
    // You can add the username and password also in order to authenticate your socket.io server....
    useEffect(() => {
        const socket = io('https://192.168.0.102:5000');
    }, [])
    return (
        <Box sx={{ width: "max-content", margin: "0 auto", marginTop: "2%", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column" }}>
            <h1 style={{ fontFamily: "poppins", fontSize: "50px", color: "#003135", textDecoration: "underline", textUnderlineOffset: "10px" }}>
                Video chat application
            </h1>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5%", width: "110%" }}>
                <video src="" autoPlay playsInline controls height="300px"></video>
                <video src="" autoPlay playsInline controls height="300px"></video>
            </Box>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                marginTop={3}
            >
                <Button size="lg" variant="solid" color="success" >
                    Call
                </Button>
                <Button size="lg" variant="solid" color="primary" >
                    Pick up!
                </Button>
                <Button size="lg" variant="solid" color="danger" >
                    End Call
                </Button>
            </Stack>
        </Box>
    )
}