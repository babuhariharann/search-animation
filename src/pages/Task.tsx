/** package import */
import React, { useState } from "react";
import type { ReactNode } from "react";
import { RiSearchLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlinePaperClip } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { BsChat } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import CountUp from "react-countup";

/** local file import */

import styles from "../assets/styles/task.module.css";
import { dataList, type DataItem } from "../data/data";
import DataAction from "../components/DataAction";
import Highlight from "../components/Highlight";
import Loader from "../components/Loader";
import NoData from "../components/NoData";

/** code */

interface TabsOptions {
  id: number;
  name: string;
  isIcon: ReactNode | null;
  iconSize: number | undefined;
  count: number;
  isShown: boolean;
}

interface SettingData {
  id: number;
  name: string;
  icon: ReactNode;
  iconSize: number;
  isChecked: boolean;
}

// interface InitialStates {
//   settingOpen: boolean;
// }
// const initialState: InitialStates = {
//   settingOpen: false,
// };

const Task = () => {
  const [search, setSearch] = useState<string>("");
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [datas, setDatas] = useState<DataItem[]>([]);
  // const [datas, setDatas] = useState<DataItem[]>(dataList);
  const [linkCopied, setLinkCopied] = useState<null | string>(null);
  const [enableActions, setEnableActions] = useState<null | number>(null);

  // const reducerFunction = () => {};

  // const [state, dispatch] = useReducer(reducerFunction, initialState);

  const [tabsOptions, setTabsOptions] = useState<TabsOptions[]>([
    {
      id: 1,
      name: "All",
      isIcon: null,
      iconSize: undefined,
      count: 0,
      isShown: true,
    },
    {
      id: 2,
      name: "Files",
      isIcon: <AiOutlinePaperClip />,
      iconSize: 20,
      count: 0,
      isShown: true,
    },
    {
      id: 3,
      name: "People",
      isIcon: <FiUser />,
      iconSize: 18,
      count: 0,
      isShown: true,
    },
    {
      id: 4,
      name: "Chat",
      isIcon: <BsChat />,
      iconSize: 20,
      count: 0,
      isShown: false,
    },
    {
      id: 5,
      name: "List",
      isIcon: <BsList />,
      iconSize: 20,
      count: 0,
      isShown: false,
    },
  ]);

  const [settingData] = useState<SettingData[]>([
    {
      id: 1,
      name: "Files",
      icon: <AiOutlinePaperClip />,
      iconSize: 20,
      isChecked: true,
    },
    { id: 2, name: "People", icon: <FiUser />, iconSize: 20, isChecked: true },
    { id: 3, name: "Chat", icon: <BsChat />, iconSize: 20, isChecked: false },
    { id: 4, name: "List", icon: <BsList />, iconSize: 20, isChecked: false },
  ]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setLoading(true);

    if (value.length > 0) {
      setTimeout(() => {
        setIsExpand(true);
      }, 300);
    } else {
      setTimeout(() => {
        setIsExpand(false);
      }, 300);
    }

    const filterName = dataList.filter((data) =>
      data.name.toLowerCase().includes(value)
    );

    setDatas(filterName);

    const peopleCount = filterName.filter(
      (item) => item.type === "people"
    ).length;
    const fileCount = filterName.filter((item) => item.type === "files").length;

    setTabsOptions((prev) =>
      prev.map((tab) => {
        if (tab.name === "All") {
          return { ...tab, count: filterName.length };
        }

        if (tab.name === "People") {
          return { ...tab, count: peopleCount };
        }
        if (tab.name === "Files") {
          return { ...tab, count: fileCount };
        }
        return tab;
      })
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setSearch("");
    setTimeout(() => {
      setIsExpand(false);
      setSearch("");
    }, 300);
  };

  const filteredData =
    activeTab === "All"
      ? datas
      : activeTab === "People"
      ? datas.filter((item) => item.type === "people")
      : activeTab === "Files"
      ? datas.filter((item) => item.type === "files")
      : [];

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    console.log("copiedvalue", value);
    setLinkCopied(value);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.searchContainer} ${
          isExpand ? styles.expand : styles.notExpand
        }`}
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {/* <span className={styles.loader}></span> */}

            <div className={styles.searchLoaderWrapper}>
              {loading ? (
                <div className={`${styles.loader} ${styles.pump}`}></div>
              ) : (
                <RiSearchLine
                  className={`${styles.headerSearchIcon} ${styles.pump}`}
                />
              )}
            </div>
            <input
              type="text"
              className={styles.headerInput}
              placeholder="Searching is easier"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleOnchange(e)
              }
            />
          </div>
          <div className={styles.headerRight}>
            <button className={styles.borderLessButton} onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.bodyActions}>
            <div className={styles.tabs}>
              {tabsOptions.map((tab) => {
                return (
                  tab.isShown && (
                    <button
                      className={`${styles.tabButton} ${
                        tab.name == activeTab ? styles.active : ""
                      }`}
                      key={tab.id}
                      onClick={() => setActiveTab(tab.name)}
                    >
                      {tab.isIcon && (
                        <span
                          className={styles.tabIcon}
                          style={{
                            fontSize: tab.iconSize ? tab.iconSize : undefined,
                          }}
                        >
                          {tab.isIcon}
                        </span>
                      )}
                      {tab.name}
                      <span className={styles.count}>
                        {loading ? (
                          0
                        ) : (
                          <CountUp start={0} duration={1} end={tab.count} />
                        )}
                      </span>
                    </button>
                  )
                );
              })}
            </div>

            <div className={styles.settingContainer}>
              <button
                className={`${styles.settingBtn} ${
                  settingOpen ? styles.open : styles.close
                }`}
                onClick={() => setSettingOpen((prev) => !prev)}
              >
                <IoSettingsOutline />
              </button>

              <ul
                className={`${styles.settingList} ${
                  settingOpen ? styles.opened : ""
                }`}
              >
                {settingData.map((list) => (
                  <li key={list.id}>
                    <div className={styles.liLeft}>
                      <span
                        className={styles.settingLiIcon}
                        style={{
                          fontSize: list.iconSize ? list.iconSize : undefined,
                        }}
                      >
                        {list.icon}
                      </span>
                      <span
                        className={`${styles.settingLiName} ${
                          tabsOptions.some(
                            (item) => item.name == list.name && item.isShown
                          )
                            ? styles.active
                            : ""
                        }`}
                      >
                        {list.name}
                      </span>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={tabsOptions.some(
                          (item) => item.name == list.name && item.isShown
                        )}
                        onChange={() =>
                          setTabsOptions((prev) =>
                            prev.map((item) =>
                              item.name === list.name
                                ? { ...item, isShown: !item.isShown }
                                : item
                            )
                          )
                        }
                      />
                      <span
                        className={`${styles.slider} ${styles.round}`}
                      ></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.bodyListContainer}>
            {loading ? (
              ["1", "2", "3", "4", "5"].map((item) => (
                <div key={item} className={styles.loaderList}>
                  <Loader />
                </div>
              ))
            ) : filteredData.length ? (
              filteredData.map((item, index) => {
                if (!item || !item.type) return null;
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={styles.dataList}
                    onMouseOver={() => setEnableActions(item.id)}
                    onMouseLeave={() => setEnableActions(null)}
                  >
                    {item.type == "people" && (
                      <div className={styles.dataListContainer}>
                        <div className={styles.dataListContent}>
                          <div
                            className={`${styles.profileWrapper}  ${
                              item.status == "active"
                                ? styles.active
                                : styles.offline
                            }`}
                          >
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className={styles.dataListRight}>
                            <p className={styles.dataListName}>
                              <Highlight text={item.name} highlight={search} />
                            </p>
                            <small className={`${styles.dataListDesc}`}>
                              {item.statusText}
                            </small>
                          </div>
                        </div>
                        {enableActions == item.id && (
                          <DataAction
                            item={item}
                            handleCopy={handleCopy}
                            linkCopied={linkCopied}
                          />
                        )}
                      </div>
                    )}
                    {item.type == "files" && (
                      <div className={styles.dataListContainer}>
                        <div className={styles.dataListContent}>
                          <div className={`${styles.iconWrapper}`}>
                            {<item.icon />}
                          </div>
                          <div className={styles.dataListRight}>
                            <p className={styles.dataListName}>
                              <Highlight text={item.name} highlight={search} />
                            </p>
                            <small className={`${styles.dataListDesc}`}>
                              in <span> {item.location}</span>{" "}
                              <span className={styles.split}>
                                <GoDotFill />
                              </span>
                              <span>{item.lastEdit}</span>
                            </small>
                          </div>
                        </div>
                        {enableActions == item.id && (
                          <DataAction
                            item={item}
                            handleCopy={handleCopy}
                            linkCopied={linkCopied}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
