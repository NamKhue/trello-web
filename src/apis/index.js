import axios from "axios";

// import { API_ROOT } from "~/utils/constants";
import { API_ROOT_V1 } from "~/utils/constants";

// interceptors - 61

// ================================================================================================

// ================================================================================================
// ================================================================================================
// AUTHEN

// REGISTER
export const signUpNewAccountAPI = async (newAccount) => {
  {
    try {
      const response = await axios.post(
        `${API_ROOT_V1.USER}/register`,
        newAccount
      );
      return response;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return error.response.data.message;
      } else {
        return "An unexpected error occurred. Please try again.";
      }
    }
  }
};

// LOGIN
export const logInAccountAPI = async (accountData) => {
  {
    try {
      const response = await axios.post(
        `${API_ROOT_V1.USER}/login`,
        accountData
      );
      return response;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return error.response.data.message;
      } else {
        return "An unexpected error occurred. Please try again.";
      }
    }
  }
};

// GET DETAILS OF USER
export const detailsAccountAPI = async (authToken) => {
  {
    try {
      const response = await axios.get(`${API_ROOT_V1.USER}/userInformation`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      return response;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return error.response.data.message;
      } else {
        return "An unexpected error occurred. Please try again.";
      }
    }
  }
};

// ================================================================================================
// ================================================================================================
// BOARD USERS

// GET BOARDS
export const fetchOwnerBoardsAPI = async () => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.get(`${API_ROOT_V1.BOARD_USER}/ownerBoards`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

export const fetchMemberBoardsAPI = async () => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.get(`${API_ROOT_V1.BOARD_USER}/memberBoards`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

// GET ALL MEMBERS IN BOARD
export const fetchAllMembersAPI = async (boardId) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.get(`${API_ROOT_V1.BOARD_USER}/allMembers`, {
    headers: { Authorization: `Bearer ${authToken}` },
    params: {
      boardId: boardId,
    },
  });

  return response.data;
};

// ROLE IN BOARD
export const fetchRoleOfBoardsAPI = async (boardId) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.get(`${API_ROOT_V1.BOARD_USER}/roleOfBoard`, {
    headers: { Authorization: `Bearer ${authToken}` },
    params: {
      boardId: boardId,
    },
  });

  return response.data;
};

// INVITE MEMBER
export const inviteMemberAPI = async (invitation) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_ROOT_V1.BOARD_USER}/invite`,
    invitation,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  return response.data;
};

// REMOVE MEMBER
export const removeMemberAPI = async (removeData) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_ROOT_V1.BOARD_USER}/remove-user`,
    removeData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  return response.data;
};

// REMOVE MEMBER
export const changeRoleOfMemberAPI = async (roleChangeData) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.post(
    `${API_ROOT_V1.BOARD_USER}/changeRole`,
    roleChangeData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  return response.data;
};

// ================================================================================================
// ================================================================================================
// BOARDS

// GET BOARDS
export const fetchAllBoardsAPI = async () => {
  const authToken = localStorage.getItem("authToken");

  // const response = await axios.get(`${API_ROOT}/v1/boards`);
  const response = await axios.get(`${API_ROOT_V1.BOARD}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

export const fetchMyBoardsAPI = async () => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.get(`${API_ROOT_V1.BOARD}/myBoards`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

// CREATE BOARD
export const createNewBoardAPI = async (newBoardData) => {
  const authToken = localStorage.getItem("authToken");

  // const response = await axios.post(`${API_ROOT}/v1/boards`, newBoardData);
  const response = await axios.post(`${API_ROOT_V1.BOARD}`, newBoardData, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

// GET DETAILS OF BOARD
export const fetchBoardDetailsAPI = async (boardId) => {
  const authToken = localStorage.getItem("authToken");

  // const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  const response = await axios.get(`${API_ROOT_V1.BOARD}/${boardId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

// UPDATE BOARD
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.put(
    // `${API_ROOT}/v1/boards/${boardId}`,
    `${API_ROOT_V1.BOARD}/${boardId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};

// MOVE CARD TO DIFFERENT COLUMN
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.put(
    // `${API_ROOT}/v1/boards/supports/moving_card`,
    `${API_ROOT_V1.BOARD}/supports/moving_card`,
    updateData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  return response.data;
};

// ================================================================================================
// ================================================================================================
// COLUMNS

// CREATE NEW COLUMN
export const createNewColumnAPI = async (boardId, newColumnData) => {
  const authToken = localStorage.getItem("authToken");

  // const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData);
  const response = await axios.post(`${API_ROOT_V1.COLUMN}`, newColumnData, {
    headers: { Authorization: `Bearer ${authToken}` },
    params: {
      boardId: boardId,
    },
  });

  return response.data;
};

// UPDATE COLUMN
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.put(
    // `${API_ROOT}/v1/columns/${columnId}`,
    `${API_ROOT_V1.COLUMN}/${columnId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
};

// DELETE COLUMN
export const deleteColumnDetailsAPI = async (columnId) => {
  const authToken = localStorage.getItem("authToken");

  // const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`);
  const response = await axios.delete(`${API_ROOT_V1.COLUMN}/${columnId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

// ================================================================================================
// ================================================================================================
// CARDS

// CREATE NEW CARD
export const createNewCardAPI = async (boardId, newCardData) => {
  const authToken = localStorage.getItem("authToken");

  // const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
  const response = await axios.post(`${API_ROOT_V1.CARD}`, newCardData, {
    headers: { Authorization: `Bearer ${authToken}` },
    params: {
      boardId: boardId,
    },
  });

  return response.data;
};

// UPDATE CARD
export const updateCardDetailsAPI = async (cardId, updateData) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.put(
    `${API_ROOT_V1.CARD}/${cardId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  return response.data;
};

// DELETE CARD
export const deleteCardDetailsAPI = async (cardId) => {
  const authToken = localStorage.getItem("authToken");

  const response = await axios.delete(`${API_ROOT_V1.CARD}/${cardId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  return response.data;
};

// ================================================================================================
// ================================================================================================
