import * as axios from "axios";


const instance = axios.create({
    baseURL: 'https://api.chatengine.io/',
    headers: {
        "PRIVATE-KEY": "601092b9-db92-4a70-9cbc-5468030293f9",
    },
});

export const chatApi = {
    createUser(data) {
        return instance.put(`users/`, data)
            .then(response => {
                return response.data;
            });
    },
    userIsTyping(selectedChat,chatConfig) {
        return instance.post(`chats/${selectedChat}/typing/`,{ },{headers: {
                'Project-ID': chatConfig.projectID,
                'User-Name': chatConfig.userName,
                'User-Secret': chatConfig.userSecret
            }})
            .then(response => {
                return response.data;
            });
    },
    getLatestMessages(chatId, chatCount, chatConfig) {
        return instance.get(`chats/${chatId}/messages/latest/${chatCount}/`,{ },{headers: {
                'Project-ID': chatConfig.projectID,
                'User-Name': chatConfig.userName,
                'User-Secret': chatConfig.userSecret
            }})
            .then(response => {
                return response.data;
            });
    }

};
window.api = chatApi;
