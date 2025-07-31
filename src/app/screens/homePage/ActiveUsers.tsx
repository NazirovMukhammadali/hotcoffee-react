import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { CssVarsProvider, Typography } from "@mui/joy";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";

const activeUsers = [
    { memberNick: "Martin", memberImage: "/img/martin.webp" },
    { memberNick: "Justin", memberImage: "/img/justin.webp" },
    { memberNick: "Rose", memberImage: "/img/rose.webp" },
    { memberNick: "Nusret", memberImage: "/img/nusret.webp" },
];

export default function ActiveUsers() {
    return (
        <div className="active-users-frame">
            <Container>
                <Stack className="main">
                    <Box className="category-title">Active Users</Box>
                    <Stack className="cards-frame" direction="row" spacing={2} flexWrap="wrap">
                        <CssVarsProvider>
                            {activeUsers.length !== 0 ? (
                                activeUsers.map((user, index) => (
                                    <Card key={index} variant="outlined" className="card" sx={{ width: 200 }}>
                                        <CardOverflow>
                                            <AspectRatio ratio="1">
                                                <img src={user.memberImage} alt={user.memberNick} loading="lazy" />
                                            </AspectRatio>
                                        </CardOverflow>

                                        <CardOverflow variant="soft" className="user-detail">
                                            <Stack className="info" spacing={1}>
                                                <Typography className="memberNick" textAlign="center">
                                                    {user.memberNick}
                                                </Typography>
                                            </Stack>
                                        </CardOverflow>
                                    </Card>
                                ))
                            ) : (
                                <Box className="no-data">No Active Users!</Box>
                            )}
                        </CssVarsProvider>
                    </Stack>
                </Stack>
            </Container>
        </div>
    );
}