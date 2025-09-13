/** package import */
import React from "react";
import { IoIosLink } from "react-icons/io";
import { RxExternalLink } from "react-icons/rx";
import { Tooltip } from "react-tooltip";
import { MdCheck } from "react-icons/md";

/** local file import */

import styles from "../assets/styles/dataAction.module.css";
import type { DataItem } from "../data/data";

/** code */

interface DataActionProps {
  item: DataItem;
  handleCopy: (name: string) => void;
  linkCopied: string | null;
}

const DataAction: React.FC<DataActionProps> = ({
  item,
  handleCopy,
  linkCopied,
}) => {
  return (
    <div className={styles.dataActions}>
      <a id="not-clickable">
        <button
          className={styles.linkButton}
          onClick={() => handleCopy(item.name)}
        >
          <IoIosLink fontSize={20} />

          {/* <span className={styles.copyStatus}>Copy Link</span> */}
        </button>
      </a>
      <Tooltip
        anchorSelect="#not-clickable"
        noArrow={true}
        place="top"
        positionStrategy="fixed"
        className="custom-tootlip"
        offset={5}
      >
        {linkCopied == item.name ? (
          <div className={styles.tooltipText}>
            <MdCheck className={styles.copySuccess} />
            Link Copied
          </div>
        ) : (
          "Copy Link"
        )}
      </Tooltip>
      <button className={styles.iconButton}>
        <RxExternalLink fontSize={20} /> <span>New Tab</span>
      </button>
    </div>
  );
};

export default DataAction;
