import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";

import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";

// purpose for display time ago
import en_short from "timeago.js/lib/lang/en_short";
// register
timeago.register("en_US", en_short);

import { TextField, Box, Paper, List, ListItem } from "@mui/material";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SendIcon from "@mui/icons-material/Send";

import { getCommentsAPI, createNewCommentAPI, createNewReplyAPI } from "~/apis";

import { useAuth } from "~/hooks/useAuth";
import socket from "~/utils/socket/socket";

const CommentSection = ({ card, userIsMemberOfCard }) => {
  // ============================================================================
  const { loggedInUser } = useAuth();
  // ============================================================================
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  // ============================================================================
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [currentReplyId, setCurrentReplyId] = useState(null);
  const [currentReply, setCurrentReply] = useState(null);
  // ============================================================================
  const [mentions, setMentions] = useState([]);
  const [autocompleteQuery, setAutocompleteQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(-1); // Track the selected suggestion index
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isComment, setIsComment] = useState(false);

  // ============================================================================
  const newCommentRef = useRef(null);
  const replyRef = useRef(null);
  const commentsListRef = useRef(null);

  // ============================================================================
  // load comments' data
  useEffect(() => {
    if (card) {
      getCommentsAPI(card._id, card.boardId).then((resComments) => {
        setComments(resComments);
        setLoading(false);
      });
    }
  }, [card]);

  // ============================================================================
  // useEffect to scroll to top when comments are updated
  useEffect(() => {
    if (commentsListRef.current && isComment) {
      commentsListRef.current.scrollTo({
        top: 0,
        behavior: "smooth", // Ensure smooth scrolling
      });
    }
  }, [comments, isComment]); // Runs when comments array changes

  // ============================================================================
  // socket
  useEffect(() => {
    if (card && loggedInUser) {
      // new-comment
      socket.on("new-comment", (newComment) => {
        if (loggedInUser._id !== newComment.author) {
          // update UI of comment section
          setComments((prevComments) => [newComment, ...prevComments]);
        }
      });

      // new-reply
      socket.on("new-reply", (newReply) => {
        if (loggedInUser._id !== newReply.author) {
          // update UI of comment section
          setComments((prevComments) => {
            const updateComments = (comments) => {
              return comments.map((comment) => {
                if (comment._id === newReply.parentComment) {
                  return {
                    ...comment,
                    replies: [newReply, ...comment.replies],
                  };
                } else if (comment.replies) {
                  return {
                    ...comment,
                    replies: updateComments(comment.replies),
                  };
                }
                return comment;
              });
            };

            return updateComments(prevComments);
          });
        }
      });
    }
  }, [card, loggedInUser]);

  // ============================================================================
  const findMentionedUser = async (query) => {
    // Simulate fetching user suggestions based on query
    return card.members.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  // ============================================================================
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    updateSuggestionPosition(e.target);
    handleMentions(value, setNewComment);

    if (currentReplyId !== null) {
      setReplyContent("");
      replyRef.current?.blur();
      setCurrentReplyId(null);
      setCurrentReply(null);
    }
  };

  const handleReplyChange = (e) => {
    const value = e.target.value;
    setReplyContent(value);
    updateSuggestionPosition(e.target);
    handleMentions(value, setReplyContent);

    if (newComment.trim() !== "") {
      setNewComment("");
      newCommentRef.current?.blur(); // Close comment field
    }
  };

  // ============================================================================
  const handleMentions = (value, setContent) => {
    const atIndex = value.lastIndexOf("@");
    if (atIndex !== -1) {
      const query = value.substring(atIndex + 1);
      setAutocompleteQuery(query);
      findMentionedUser(query).then((users) => {
        setSuggestions(users);
        setMentionIndex(-1);
      });
    } else {
      setSuggestions([]);
    }

    // Extract mentions from the input
    const mentionedUsers = extractMentions(value);
    setMentions(mentionedUsers);
  };

  const extractMentions = (text) => {
    const mentionPattern = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionPattern.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  };

  // ============================================================================
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        setMentionIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        setMentionIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
        break;
      case "Enter":
        e.preventDefault();
        selectUser(suggestions[mentionIndex]);
        break;
      case "Escape":
        setSuggestions([]);
        break;
      default:
        break;
    }
  };

  // ============================================================================
  const selectUser = (user) => {
    const atIndex = (
      currentReplyId === null ? newComment : replyContent
    ).lastIndexOf("@");
    const beforeAt = (
      currentReplyId === null ? newComment : replyContent
    ).substring(0, atIndex);
    const afterAt = (currentReplyId === null ? newComment : replyContent)
      .substring(atIndex)
      .replace(/@[\w]*$/, `@${user.username} `);

    const updatedContent = beforeAt + afterAt;

    if (currentReplyId === null) {
      setNewComment(updatedContent);

      newCommentRef.current.children[0].children[0].focus();
    } else {
      setReplyContent(updatedContent);

      replyRef.current.children[0].children[0].focus();
    }

    setMentions((prev) => [...prev, user.username]);
    setSuggestions([]);
    setMentionIndex(-1);
  };

  // ============================================================================
  const updateSuggestionPosition = (target) => {
    if (target) {
      const rect = target.getBoundingClientRect();
      setSuggestionPosition({
        top: rect.bottom + window.scrollY + 6 - 80,
        // left: rect.left + window.scrollX - 1115,
        left: rect.left + window.scrollX - 280,
      });
    }
  };

  // ============================================================================
  const submitComment = async () => {
    if (newComment.trim() === "") return;

    const newCommentData = {
      author: loggedInUser._id,
      parentComment: null,
      content: newComment,
      mentions: mentions.map(
        (username) =>
          card.members.find((user) => user.username === username)?.userId
      ),
    };

    // console.log("newCommentData ", newCommentData);

    let resNewComment = await createNewCommentAPI(
      card._id,
      card.boardId,
      newCommentData
    );

    //
    let savedComment = resNewComment.getNewComment;
    savedComment = { ...savedComment, replies: [] };
    socket.emit(
      "new-comment",
      card.boardId,
      savedComment,
      resNewComment.listNotiForAllMembersOfCard
    );

    setComments((prevComments) => [savedComment, ...prevComments]);
    setNewComment("");
    setMentions([]);
    setIsComment(true);
  };

  // ============================================================================
  const submitReply = async () => {
    if (replyContent.trim() === "" || currentReplyId === null) return;

    const newReplyData = {
      author: loggedInUser._id,
      parentComment: currentReplyId,
      content: replyContent,
      mentions: mentions.map(
        (username) =>
          card.members.find((user) => user.username === username)?.userId
      ),
    };

    // console.log("newReplyData ", newReplyData);

    // Post the new reply comment
    const resNewReply = await createNewReplyAPI(
      card._id,
      card.boardId,
      newReplyData
    );

    // console.log(
    //   "listNotiForBothRepliesAndParentComment ",
    //   resNewReply.listNotiForBothRepliesAndParentComment
    // );

    //
    let savedReply = resNewReply.getNewReply;
    savedReply = { ...savedReply, replies: [] };
    socket.emit(
      "new-reply",
      card.boardId,
      savedReply,
      resNewReply.listNotiForBothRepliesAndParentComment
    );

    // Update the comments state to include the new reply
    setComments((prevComments) => {
      const updateComments = (comments) => {
        return comments.map((comment) => {
          if (comment._id === currentReplyId) {
            return {
              ...comment,
              replies: [savedReply, ...comment.replies],
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies),
            };
          }
          return comment;
        });
      };

      return updateComments(prevComments);
    });

    // Clear reply input fields
    setReplyContent("");
    setMentions([]);
    setCurrentReplyId(null);
    setCurrentReply(null);
    setIsComment(false);
  };

  // ============================================================================
  const renderCommentContent = (content) => {
    const mentionPattern = /@(\w+)/g;
    return content.split(mentionPattern).map((part, index) => {
      if (index % 2 === 1) {
        const user = card.members.find((user) => user.username === part);
        if (user) {
          return (
            <Box
              key={index}
              component="span"
              sx={{
                fontWeight: "bold",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_D7D7D7
                    : theme.trelloCustom.COLOR_313131,
              }}
            >
              @{part}{" "}
            </Box>
          );
        }
      }
      return (
        <Box
          key={index}
          component="span"
          sx={{
            fontSize: ".9rem",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_D7D7D7
                : theme.trelloCustom.COLOR_313131,
          }}
        >
          {part}
        </Box>
      );
    });
  };

  // ============================================================================
  const sortCommentsByDate = (comments) => {
    return comments.sort((a, b) => {
      const dateA = DateTime.fromMillis(a.createdAt);
      const dateB = DateTime.fromMillis(b.createdAt);
      return dateB.toMillis() - dateA.toMillis();
    });
  };

  const renderComments = (comments, isReplies) => {
    const sortedComments = sortCommentsByDate(comments);
    // console.log("🚀 sortedComments:", sortedComments);

    const lastItemOfSortedComments = sortedComments[sortedComments.length - 1];

    return sortedComments.map((comment) => (
      <Box
        key={comment._id}
        sx={{
          mr: 0.5,
          mb: !isReplies
            ? lastItemOfSortedComments._id !== comment._id
              ? 1
              : "1px"
            : 0,
          px: !isReplies ? 1 : 3,
          pt: !isReplies ? 1 : 0.5,
          pb: !isReplies ? 0.5 : 0.5,
          borderRadius: "10px",
          border: (theme) =>
            theme.palette.mode === "dark"
              ? !isReplies
                ? // ? `2px solid ${theme.trelloCustom.COLOR_818181}`
                  `2px solid #3c0e5e`
                : "none"
              : !isReplies
              ? `2px solid ${theme.trelloCustom.COLOR_D7D7D7}`
              : "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box
            sx={{
              mt: 0.25,
              height: !isReplies ? "35px" : "30px",
              width: !isReplies ? "35px" : "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor: "#ddd",
            }}
          ></Box>

          <Box
            sx={{
              flex: 9,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0,
            }}
          >
            <Box
              sx={{
                fontWeight: "bold",
                fontSize: ".95rem",

                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_D7D7D7
                    : theme.trelloCustom.COLOR_313131,
              }}
            >
              {
                card.members.find((user) => user.userId === comment.author)
                  ?.username
              }
            </Box>

            <Box sx={{}}>{renderCommentContent(comment.content)}</Box>

            <Box
              sx={{
                height: "20px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_818181
                      : theme.trelloCustom.COLOR_818181,
                }}
              >
                {/* {DateTime.fromISO(comment.createdAt).toRelative()} */}
                <TimeAgo datetime={comment.createdAt} locale="en" />
              </Box>

              {!isReplies && userIsMemberOfCard && (
                <FiberManualRecordIcon
                  sx={{
                    "&.MuiSvgIcon-root": {
                      width: ".2em",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_818181
                          : theme.trelloCustom.COLOR_818181,
                    },
                  }}
                />
              )}

              {!isReplies && userIsMemberOfCard && (
                <Box
                  onClick={() => {
                    if (currentReplyId !== comment._id) {
                      setCurrentReplyId(comment._id);
                      setCurrentReply(comment);
                      setReplyContent("");

                      newCommentRef.current?.blur();
                    } else {
                      setCurrentReplyId(null);
                      setCurrentReply(null);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    // px: 1.25,
                    py: 0.25,
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_818181
                        : theme.trelloCustom.COLOR_818181,
                    borderRadius: "4px",

                    "&:hover": {
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_D7D7D7
                          : theme.trelloCustom.COLOR_313131,
                    },
                  }}
                >
                  {currentReplyId !== comment._id ? "Reply" : "Close"}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 0,
            ml: 2.25,
          }}
        >
          {currentReplyId === comment._id && (
            <Box sx={{ mt: 0, ml: 3 }}>
              <Box
                sx={{
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  my: 0.5,
                }}
              >
                <Box
                  sx={{
                    height: "30px",
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "#ddd",
                  }}
                ></Box>

                <TextField
                  autoFocus
                  multiline
                  fullWidth
                  maxRows={1}
                  value={replyContent}
                  onChange={handleReplyChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a reply..."
                  ref={replyRef}
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-root.MuiOutlinedInput-root": {
                      height: "35px",
                      pr: 2,
                      borderRadius: "20px",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_D7D7D7
                          : theme.trelloCustom.COLOR_313131,
                      "& fieldset": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_281E38
                            : theme.trelloCustom.COLOR_313131,
                      },
                      "&:hover fieldset": {
                        borderWidth: "1px",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_281E38
                            : theme.trelloCustom.COLOR_313131,
                      },
                    },

                    "&.MuiFormControl-root.MuiTextField-root.MuiFormControl-root.MuiTextField-root .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused":
                      {
                        "& fieldset": {
                          borderWidth: "1px",
                          borderColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_281E38
                              : theme.trelloCustom.COLOR_313131,
                        },
                      },

                    "&.MuiFormControl-root.MuiTextField-root .MuiInputBase-root.MuiOutlinedInput-root":
                      {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_281E38
                            : "transparent",
                      },
                    "& .MuiInputBase-input.MuiOutlinedInput-input": {
                      fontSize: ".85rem",
                    },
                  }}
                  InputProps={{
                    endAdornment: replyContent && (
                      <Box
                        onClick={submitReply}
                        sx={{
                          // width: "fit-content",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: ".85rem",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? theme.trelloCustom.COLOR_D7D7D7
                              : theme.trelloCustom.COLOR_313131,
                        }}
                      >
                        <SendIcon
                          sx={{
                            height: "20px",
                            width: "20px",
                            fontSize: "1.1rem",
                          }}
                        />
                      </Box>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}

          {!isReplies &&
            comment.replies &&
            renderComments(comment.replies, true)}
        </Box>
      </Box>
    ));
  };

  // ============================================================================
  // ============================================================================
  return (
    <Box
      sx={{
        maxHeight: "460px",
        // height: "350px",
        mt: 1.5,
        // mx: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        ref={commentsListRef}
        sx={{
          minHeight: loading ? "250px" : 0,
          // maxHeight: "400px",
          flex: 1,
          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: "5px",
            height: "0",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_463666
                : theme.trelloCustom.COLOR_C0C0C0,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_7236AE
                : theme.trelloCustom.COLOR_818181,
          },
        }}
      >
        {!loading ? (
          !comments.length ? (
            <Box
              sx={{
                height: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Comment is empty
            </Box>
          ) : (
            renderComments(comments, false)
          )
        ) : (
          <Box
            sx={{
              minHeight: loading ? "250px" : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {"Loading..."}
          </Box>
        )}
      </Box>

      {suggestions.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: suggestionPosition.top,
            left: suggestionPosition.left,
            zIndex: 2,
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "12px",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_E6E6E6
                : theme.trelloCustom.COLOR_313131,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_13091B
                : theme.trelloCustom.COLOR_F8F8F8,
          }}
        >
          <List
            sx={{
              maxHeight: "150px",
              overflowY: "auto",
              overflowX: "hidden",

              "&.MuiList-root": {
                mx: 1,
              },
            }}
          >
            {suggestions.map((user, index) => (
              <ListItem
                key={user.userId}
                onClick={() => selectUser(user)}
                selected={mentionIndex === index}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    bgcolor: "#ddd",
                  },

                  "&.MuiListItem-root": {
                    borderRadius: "8px",
                  },
                  "&.MuiListItem-root:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_463666
                        : theme.trelloCustom.COLOR_E6E6E6,
                  },
                }}
              >
                {user.username}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {userIsMemberOfCard && (
        <Box
          sx={{
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: 1.5,
            // mx: 1,
            // mt: 0.5,
            // mb: 1.5,
          }}
        >
          <Box
            sx={{
              height: "35px",
              width: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor: "#ddd",
            }}
          ></Box>

          <TextField
            multiline
            fullWidth
            maxRows={2}
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            ref={newCommentRef}
            sx={{
              flex: 1,
              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                height: "40px",
                px: 2,
                borderRadius: "20px",
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_D7D7D7
                    : theme.trelloCustom.COLOR_313131,
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_281E38
                      : theme.trelloCustom.COLOR_313131,
                },
                "&:hover fieldset": {
                  borderWidth: "1px",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_281E38
                      : theme.trelloCustom.COLOR_313131,
                },
              },

              "&.MuiFormControl-root.MuiTextField-root.MuiFormControl-root.MuiTextField-root .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused":
                {
                  "& fieldset": {
                    borderWidth: "1px",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_281E38
                        : theme.trelloCustom.COLOR_313131,
                  },
                },

              "&.MuiFormControl-root.MuiTextField-root .MuiInputBase-root.MuiOutlinedInput-root":
                {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_281E38
                      : "transparent",
                },

              "& .MuiInputBase-input.MuiOutlinedInput-input": {
                fontSize: "1rem",
              },
            }}
            InputProps={{
              endAdornment: newComment && (
                <Box
                  onClick={submitComment}
                  sx={{
                    cursor: "pointer",
                    mx: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ".95rem",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_D7D7D7
                        : theme.trelloCustom.COLOR_313131,
                  }}
                >
                  <SendIcon
                    sx={{
                      p: 0.3,
                      height: "30px",
                      width: "30px",
                      fontSize: "1.2rem",
                    }}
                  />
                </Box>
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
