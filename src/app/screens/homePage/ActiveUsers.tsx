import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { CardOverflow, CssVarsProvider, Typography } from "@mui/joy";
import Divider from "../../components/divider";
import AspectRatio from "@mui/joy/AspectRatio";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";


const topUsersRetriever = createSelector(
    retrieveTopUsers,
    (topUsers) => ({
        topUsers,
    })
);

export default function ActiveUsers() {
    const { topUsers } = useSelector(topUsersRetriever);
    return (
        <div className={"active-users-frame"}>
            <Container>
                <Stack className="main">
                    <Box className="category-title">Active Users</Box>

                    <CssVarsProvider>
                        <Stack className="cards-frame">
                            {topUsers.length !== 0 ? (
                                topUsers.map((member: Member) => {
                                    const imagePath = `${serverApi}/${member.memberImage}`;
                                    return (
                                        <Card variant="outlined" className="card" key={member._id}>
                                            <CardOverflow>
                                                <AspectRatio ratio="1">
                                                    <img src={imagePath} alt={member.memberNick} />
                                                </AspectRatio>
                                            </CardOverflow>
                                            <CardOverflow variant="soft" className="member-nickname">
                                                <Typography>{member.memberNick}</Typography>
                                            </CardOverflow>
                                            <Stack>
                                                <Divider />
                                            </Stack>
                                        </Card>
                                    );
                                })
                            ) : (
                                <Box className="no-data">Active Users!</Box>
                            )}
                        </Stack>
                    </CssVarsProvider>
                </Stack>
            </Container>
        </div>
    );
}