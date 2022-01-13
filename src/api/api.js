import * as axios from "axios";


const instance = axios.create({
    baseURL: 'https://api.chatengine.io/',
    headers: {
        "PRIVATE-KEY": "3c679afb-1b00-4a87-a282-faf433fe4e2e",
    },
});

export const chatApi = {
    createUser(data) {
        return instance.post(`users/`, data)
            .then(response => {
                return response.data;
            });
    },
    authenticate(chatConfig) {
        return instance.get(`users/me/`, {
            headers: {
                "Project-ID" : chatConfig.projectID,
                "User-Name" : chatConfig.userName,
                "User-Secret" : chatConfig.userSecret
            }
        })
            .then(response => {
                return response.data;
            })
    },
    updateMyDetails(file, chatConfig) {
        const formData = new FormData();
        formData.append('avatar', file);
        return instance.patch(`users/me/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Project-ID': chatConfig.projectID,
                'User-Name': chatConfig.userName,
                'User-Secret': chatConfig.userSecret
            }
        }).then(response => {
            return response.data;
        });
    },
    getUser() {
        return instance.get(`users`)
            .then(response => {
                return response.data;
            });
    },
    userIsTyping(selectedChat, chatConfig) {
        return instance.post(`chats/${selectedChat}/typing/`, {}, {
            headers: {
                'Project-ID': chatConfig.projectID,
                'User-Name': chatConfig.userName,
                'User-Secret': chatConfig.userSecret
            }
        })
            .then(response => {
                return response.data;
            });
    },
    getLatestMessages(chatId, chatCount, chatConfig) {
        return instance.get(`chats/${chatId}/messages/latest/${chatCount}/`, {}, {
            headers: {
                'Project-ID': chatConfig.projectID,
                'User-Name': chatConfig.userName,
                'User-Secret': chatConfig.userSecret
            }
        })
            .then(response => {
                return response.data;
            });
    }

};
window.api = chatApi;
