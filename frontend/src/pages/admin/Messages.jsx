import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllMessages,
  markMessageAsRead,
  deleteMessage,
} from "../../services/message.service.js";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  const fetchMessages = async () => {
    try {
      const { data } = await getAllMessages();

      setMessages(data.data || []);

      if (data.data?.length > 0) {
        setSelectedMessage((current) => {
          if (!current) return data.data[0];

          return (
            data.data.find(
              (msg) => msg._id === current._id
            ) || data.data[0]
          );
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("FAILED TO LOAD MESSAGES");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async () => {
    if (!selectedMessage) return;

    try {
      await markMessageAsRead(selectedMessage._id);

      toast.success("MESSAGE MARKED AS READ");

      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("OPERATION FAILED");
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;

    const confirmed = window.confirm(
      "Delete this message permanently?"
    );

    if (!confirmed) return;

    try {
      await deleteMessage(selectedMessage._id);

      toast.success("MESSAGE DELETED");

      setSelectedMessage(null);

      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("DELETE FAILED");
    }
  };

  if (loading) {
    return (
      <div className="casio-panel p-4">
        <div className="lcd-screen p-6">
          LOADING TRANSMISSIONS...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="casio-panel p-4">

        <div className="lcd-screen lcd-breathe relative overflow-hidden">

          {/* Header */}

          <div className="border-b border-[#5d6e5d] pb-2">

            <p className="text-[0.625rem] tracking-[0.35em] opacity-70">
              COMMUNICATION ARCHIVE
            </p>

            <h1 className="casio-display text-[clamp(2rem,4vw,2.8rem)] tracking-[0.08em]">
              MESSAGES
            </h1>

            

          </div>

          {/* Main */}

          <div className="grid xl:grid-cols-[320px_1fr]">

            {/* Inbox */}

            <div
              className="
                border-r
                border-b
                border-[#5d6e5d]
                p-4
              "
            >

              <h2 className="tracking-[0.25em] text-sm mb-4">
                TRANSMISSIONS
              </h2>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">

                {messages.length === 0 && (
                  <div
                    className="
                      border
                      border-[#5d6e5d]
                      rounded
                      p-4
                    "
                  >
                    NO MESSAGES FOUND
                  </div>
                )}

                {messages.map((message) => (
                  <button
                    key={message._id}
                    onClick={() =>
                      setSelectedMessage(message)
                    }
                    className={`
                      w-full
                      text-left
                      border
                      rounded
                      p-3
                      transition-all
                      border-[#5d6e5d]
                      cursor-pointer

                      ${
                        selectedMessage?._id ===
                        message._id
                          ? "bg-[#d7e7af]"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">

                      <div
                        className={`
                          w-2
                          h-2
                          rounded-full

                          ${
                            message.isRead
                              ? "bg-gray-500"
                              : "bg-[#05df72]"
                          }
                        `}
                      />

                      <span className="font-semibold truncate">
                        {message.name}
                      </span>

                    </div>

                    <p className="text-xs opacity-70 truncate mt-1">
                      {message.email}
                    </p>

                    <p className="text-xs truncate mt-1">
                      {message.subject}
                    </p>

                    <p className="text-[10px] mt-2 opacity-60">
                      {message.isRead
                        ? "ARCHIVED"
                        : "NEW TRANSMISSION"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Viewer */}

            <div
              className="
                border-b
                border-[#5d6e5d]
                py-4 px-6
              "
            >

              {!selectedMessage ? (
                <div className="opacity-70">
                  SELECT A MESSAGE
                </div>
              ) : (
                <>
                  <h2 className="casio-display text-2xl mb-6">
                    MESSAGE VIEWER
                  </h2>

                  <div className="space-y-5">

                    <div>
                      <p className="text-xs opacity-60 tracking-[0.2em]">
                        FROM
                      </p>

                      <p>{selectedMessage.name}</p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60 tracking-[0.2em]">
                        EMAIL
                      </p>

                      <p>{selectedMessage.email}</p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60 tracking-[0.2em]">
                        SUBJECT
                      </p>

                      <p>{selectedMessage.subject}</p>
                    </div>

                    <div>
                      <p className="text-xs opacity-60 tracking-[0.2em]">
                        MESSAGE BODY
                      </p>

                      <div
                        className="
                          mt-2
                          border
                          border-[#5d6e5d]
                          rounded
                          p-4
                          min-h-[250px]
                        "
                      >
                        <p className="whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-4 mt-8">

                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="casio-lcd-btn"
                    >
                      REPLY VIA EMAIL
                    </a>

                    {!selectedMessage.isRead && (
                      <button
                        onClick={handleMarkRead}
                        className="casio-lcd-btn cursor-pointer"
                      >
                        MARK READ
                      </button>
                    )}

                    <button
                      onClick={handleDelete}
                      className="casio-btn px-2 cursor-pointer"
                    >
                      DELETE
                    </button>

                  </div>
                </>
              )}

            </div>

          </div>

          {/* Footer */}

          <div className="p-4">

            <h2 className="tracking-[0.25em] text-sm mb-4">
              NETWORK STATUS
            </h2>

            <div className="grid grid-cols-3 gap-4">

              <div>
                <p className="text-xs opacity-60">
                  TOTAL
                </p>

                <p className="casio-display text-2xl">
                  {messages.length}
                </p>
              </div>

              <div>
                <p className="text-xs opacity-60">
                  UNREAD
                </p>

                <p className="casio-display text-2xl">
                  {unreadCount}
                </p>
              </div>

              <div>
                <p className="text-xs opacity-60">
                  NETWORK
                </p>

                <p className="casio-display text-2xl">
                  100%
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Messages;

