const requests = {
  // getAllCard: `/api/allcards`,
  // getCardById: `api/getcard/`,

  // addCard: `/api/addcard`,
  // saveCard: `/api/savecard`,
  // deleteCard: `/api/deletecard`,
  // getCardTask: `/api/cardtasksbycard/`,
  // saveDone: `/api/cardtaskdone`,
  // addcardtask: `/api/addcardtask`,
  // getTaskById: `/api/getcardtask/`,
  // getSearchCards: `/api/searchcardbyname/`,

  register: `/register`,
  auth: `/auth`,
  profile: `/api/profile`,
  logout: `/api/logout`,
  updateProfile: `/api/updateprofile`,
  updatePassword: `/api/updatepassword`,
  addPost: `/api/addPost`,
  news: `/api/news`,
  getUserNews: `/api/getusernews/`,
  myfriends: `/api/myfriends/`,
  recommendfriends: `/api/recommendFriends/`,
  addFriendReques: `/api/addfriendrequest`,
  getAllUsers: `/api/allUsers`,
  getUserToEdit: `/api/allUsers/`,
  updateUser: `/api/updateUser`,
  deleteUser: `/api/deleteUser/`,
  updatePost: `/api/updatePost`,
  deletePost: `/api/deletePost/`,

  //friends
  addFriends: `/api/addFriends`,
  getAllFriends: `/api/friends`,
  getFriendsById: `/api/friends/`,
  deleteFriends: `/api/deleteFriend/`,
  zaprosNafriend:`/api/friendreceiveform/`,

  //messages
  addMessage: `/api/addMessage`,
  getAllMessages: `/api/messages`,
  getMessageById: `/api/messages/`,
  deleteMessage: `/api/deleteMessage/`,
  updateMessage: `/api/updateMessage`
};

export default requests;
