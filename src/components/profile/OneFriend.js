// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {USERS} from "../Util/Urls";
import {useEffect, useState} from "react";

export default function OneFriend(props) {
    return (
        <div>
            <Card sx={{maxWidth: 345, marginTop:"10px"}}>
                {/*<AccountCircleIcon/>*/}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.email}
                    </Typography>
                                    {!props.isFriend ?

                    <Typography variant="body2" color="text.secondary">
                       Не в  друзьях
                    </Typography> : <Typography variant="body2" color="text.secondary">
                       Вы друзья
                    </Typography>}
                </CardContent>
                {!props.isFriend ?
                    <CardActions>
                        <Button  onClick={() => props.addFriend(props.id, props.index)}>Добавить в друзья</Button>
                    </CardActions>
                    : <div></div>}
            </Card>
        </div>
    )
}