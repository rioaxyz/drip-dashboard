import React, { useState, useEffect } from "react";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Help from "../Help.md";
import { HelpCircle } from "lucide-react";

const HelpSection = () => {
  const [helpText, setHelpText] = useState("");

  useEffect(() => {
    fetch(Help)
      .then((res) => res.text())
      .then((text) => setHelpText(text));
  });

  return (
    <>
      <button
        className="btn btn-ghost btn-sm gap-2 normal-case"
        onClick={() => window.help_modal.showModal()}
      >
        <HelpCircle size={18} /> Help
      </button>
      <dialog id="help_modal" className="modal">
        <form
          method="dialog"
          className="modal-box w-11/12 max-w-5xl bg-base-100 border border-base-300"
        >
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="bg-white text-black rounded-box p-6 mt-6">
            {
              // eslint-disable-next-line react/no-children-prop
              <ReactMarkdown children={helpText} className="markdown" />
            }
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default HelpSection;
