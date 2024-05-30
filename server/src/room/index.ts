import { Socket } from "socket.io";
import {v4 as uuidV4} from 'uuid';

const rooms: Record<string, Record<string, IUser>> = {};

const chats: Record<string, IMessage[]> = {};

interface IUser {
    peerId: string,
    userName: string
}

interface IRoomParams {
    roomId: string;
    peerId: string;
}

interface IJoinRoomParams extends IRoomParams{
    userName: string,
}

interface IMessage {
    userName?: string;
    message?: string;
    value?: string;
    time: string;
    emoji?: string;
    author?: string;
  }


export const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        const roomId = uuidV4();
        rooms[roomId] = {};
        socket.emit("room-created", {roomId});
        console.log("room is created");
    }

    const joinRoom = ({roomId, peerId, userName} : IJoinRoomParams) => {
        if (!rooms[roomId]) rooms[roomId] = {};
        if (!chats[roomId]) chats[roomId] = [];
            socket.emit("get-messages", chats[roomId]);
            console.log("user joined the room", roomId, peerId, userName);
            rooms[roomId][peerId] = {peerId, userName};
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", {peerId, userName})
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId]
            })

        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            leaveRoom({roomId, peerId});
        })
    }

    const leaveRoom = ({roomId, peerId} : IRoomParams) => {
        if (rooms[roomId]) {
            delete rooms[roomId][peerId]; // Удаляем участника из комнаты
            socket.to(roomId).emit("user-disconnected", { peerId });
        }
    };

    const startSharing = ({peerId, roomId} : IRoomParams) => {
        socket.to(roomId).emit("user-started-sharing", peerId);
    }

    const stopSharing = (roomId: string) => {
        socket.to(roomId).emit("user-stop-sharing");
    }
    const addMessage = (roomId: string, message: IMessage) => {
        console.log({message});
        if(chats[roomId]) {
            chats[roomId].push(message);
        }else{
            chats[roomId] = [message];
        }
        socket.to(roomId).emit("add-message", message);
    }
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
    socket.on("send-message", addMessage);
}