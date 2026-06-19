import React, { useContext } from "react";
import { CheckCircle2 } from "lucide-react";
import { Context } from "../contexts/NotificationContext";

/**
 * Dialog component for notifications
 * @returns HTML for the notification dialog
 */
const NotificationDialog = () => {
  const [notification] = useContext(Context);

  return (
    <>
      <dialog id="notification_modal" className="modal">
        <form
          method="dialog"
          className="modal-box w-11/12 max-w-3xl bg-base-100 border border-base-300"
        >
          <button
            id="notification_dialog_close"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h1 className="font-semibold text-center py-10 text-4xl tracking-tight">
            {notification?.text ? notification?.text : ""}
          </h1>
          <div className="text-center text-sm relative pb-4">
            {notification?.txnHash ? (
              <div className="inline-flex items-center gap-2 max-w-full px-4 py-2 rounded-full bg-success/10 border border-success/30">
                <CheckCircle2 size={18} className="text-success shrink-0" />
                <span className="text-base-content/70">Txn hash:</span>
                <a
                  rel="noreferrer nofollow"
                  className="text-info no-underline font-mono truncate"
                  target="_blank"
                  href={`https://bscscan.com/tx/${notification?.txnHash}`}
                >
                  {notification?.txnHash}
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default NotificationDialog;
