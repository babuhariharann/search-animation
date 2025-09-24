/** package import */
import React, { useEffect, useReducer, useRef, useState } from "react";
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

interface State {
  search: string;
  isExpand: boolean;
  loading: boolean;
  settingOpen: boolean;
  activeTab: string;
  datas: DataItem[];
  linkCopied: string | null;
  enableActions: number | null;
  tabsOptions: TabsOptions[];
}
type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_EXPAND"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SETTING_OPEN"; payload: boolean }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "SET_DATAS"; payload: DataItem[] }
  | { type: "SET_LINK_COPIED"; payload: string | null }
  | { type: "SET_ENABLE_ACTIONS"; payload: number | null }
  | { type: "UPDATE_TABS"; payload: TabsOptions[] }
  | { type: "TOGGLE_TAB_VISIBILITY"; payload: string };

const initialState: State = {
  search: "",
  isExpand: false,
  loading: false,
  settingOpen: false,
  activeTab: "All",
  datas: [],
  linkCopied: null,
  enableActions: null,
  tabsOptions: [
    { id: 1, name: "All", iconSize: 20, isIcon: null, count: 0, isShown: true },
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
  ],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_EXPAND":
      return { ...state, isExpand: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SETTING_OPEN":
      return { ...state, settingOpen: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_DATAS":
      return { ...state, datas: action.payload };
    case "SET_LINK_COPIED":
      return { ...state, linkCopied: action.payload };
    case "SET_ENABLE_ACTIONS":
      return { ...state, enableActions: action.payload };
    case "UPDATE_TABS":
      return { ...state, tabsOptions: action.payload };
    case "TOGGLE_TAB_VISIBILITY":
      return {
        ...state,
        tabsOptions: state.tabsOptions.map((tab) =>
          tab.name === action.payload ? { ...tab, isShown: !tab.isShown } : tab
        ),
      };
    default:
      return state;
  }
}

const Task = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    dispatch({ type: "SET_SEARCH", payload: value });
    dispatch({ type: "SET_LOADING", payload: true });

    if (value.length > 0) {
      setTimeout(() => dispatch({ type: "SET_EXPAND", payload: true }), 300);
    } else {
      setTimeout(() => dispatch({ type: "SET_EXPAND", payload: false }), 300);
    }

    const filterName = dataList.filter((data) =>
      data.name.toLowerCase().includes(value)
    );

    dispatch({ type: "SET_DATAS", payload: filterName });

    const peopleCount = filterName.filter(
      (item) => item.type === "people"
    ).length;
    const fileCount = filterName.filter((item) => item.type === "files").length;

    const updatedTabs = state.tabsOptions.map((tab) => {
      if (tab.name === "All") return { ...tab, count: filterName.length };
      if (tab.name === "People") return { ...tab, count: peopleCount };
      if (tab.name === "Files") return { ...tab, count: fileCount };
      return tab;
    });

    dispatch({ type: "UPDATE_TABS", payload: updatedTabs });

    setTimeout(() => dispatch({ type: "SET_LOADING", payload: false }), 1000);
  };

  /** search clear function */

  const handleClear = () => {
    dispatch({ type: "SET_SEARCH", payload: "" });
    setTimeout(() => dispatch({ type: "SET_EXPAND", payload: false }), 300);
  };

  const filteredData =
    state.activeTab === "All"
      ? state.datas
      : state.activeTab === "People"
      ? state.datas.filter((item) => item.type === "people")
      : state.activeTab === "Files"
      ? state.datas.filter((item) => item.type === "files")
      : [];

  /** data copy function */

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    dispatch({ type: "SET_LINK_COPIED", payload: value });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (state.settingOpen) {
          dispatch({ type: "SET_SETTING_OPEN", payload: false });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.settingOpen, dispatch]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.searchContainer} ${
          state.isExpand ? styles.expand : styles.notExpand
        }`}
      >
        {/* header */}

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.searchLoaderWrapper}>
              {state.loading ? (
                <div className={`${styles.loader} ${styles.pump}`}></div>
              ) : (
                <RiSearchLine
                  className={`${styles.headerSearchIcon} ${styles.pump}`}
                />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              className={styles.headerInput}
              placeholder="Searching is easier"
              value={state.search}
              onChange={handleOnchange}
            />
          </div>
          <div className={styles.headerRight}>
            <button className={styles.borderLessButton} onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* body */}

        <div className={styles.body}>
          <div className={styles.bodyActions}>
            <div className={styles.tabs}>
              {state.tabsOptions.map((tab) => {
                return (
                  tab.isShown && (
                    <button
                      key={tab.id}
                      className={`${styles.tabButton} ${
                        tab.name === state.activeTab ? styles.active : ""
                      }`}
                      onClick={() =>
                        dispatch({
                          type: "SET_ACTIVE_TAB",
                          payload: tab.name,
                        })
                      }
                    >
                      {tab.isIcon && (
                        <span
                          className={styles.tabIcon}
                          style={{
                            fontSize: tab.iconSize,
                          }}
                        >
                          {tab.isIcon}
                        </span>
                      )}
                      {tab.name}
                      <span className={styles.count}>
                        {state.loading ? (
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

            {/* setting container */}
            <div className={styles.settingContainer} ref={containerRef}>
              <button
                className={`${styles.settingBtn} ${
                  state.settingOpen ? styles.open : styles.close
                }`}
                onClick={() =>
                  dispatch({
                    type: "SET_SETTING_OPEN",
                    payload: !state.settingOpen,
                  })
                }
              >
                <IoSettingsOutline />
              </button>

              <ul
                className={`${styles.settingList} ${
                  state.settingOpen ? styles.opened : ""
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
                          state.tabsOptions.some(
                            (item) => item.name === list.name && item.isShown
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
                        checked={state.tabsOptions.some(
                          (item) => item.name === list.name && item.isShown
                        )}
                        onChange={() =>
                          dispatch({
                            type: "TOGGLE_TAB_VISIBILITY",
                            payload: list.name,
                          })
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

          {/* Data List */}

          <div className={styles.bodyListContainer}>
            {state.loading ? (
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
                    onMouseOver={() =>
                      dispatch({
                        type: "SET_ENABLE_ACTIONS",
                        payload: item.id,
                      })
                    }
                    onMouseLeave={() =>
                      dispatch({ type: "SET_ENABLE_ACTIONS", payload: null })
                    }
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
                              <Highlight
                                text={item.name}
                                highlight={state.search}
                              />
                            </p>
                            <small className={`${styles.dataListDesc}`}>
                              {item.statusText}
                            </small>
                          </div>
                        </div>
                        {state.enableActions == item.id && (
                          <DataAction
                            item={item}
                            handleCopy={handleCopy}
                            linkCopied={state.linkCopied}
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
                              <Highlight
                                text={item.name}
                                highlight={state.search}
                              />
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
                        {state.enableActions == item.id && (
                          <DataAction
                            item={item}
                            handleCopy={handleCopy}
                            linkCopied={state.linkCopied}
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
