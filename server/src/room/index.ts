import { Socket } from "socket.io";
import {v4 as uuidV4} from 'uuid';

const rooms: Record<string, string[]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
}

export const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        const roomId = uuidV4();
        rooms[roomId] = [];
        socket.emit("room-created", {roomId});
        console.log("room is created");
    }

    const joinRoom = ({roomId, peerId} : IRoomParams) => {
        if(rooms[roomId]){
            console.log("user joined the room", roomId);
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", {peerId})
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId]
            })
        }
        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            leaveRoom({roomId, peerId})
        })
    }

    const leaveRoom = ({roomId, peerId} : IRoomParams) => {
        rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
        socket.to(roomId).emit("user-disconnected")
    }


    socket.on("create-room", createRoom)
    socket.on("join-room", joinRoom)
    socket.on("leave-room", leaveRoom)
}