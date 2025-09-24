import userOne from '../assets/images/userOne.jpg'
import userTwo from '../assets/images/userTwo.jpg'
import userThree from '../assets/images/userThree.jpg'

import type { IconType } from "react-icons";
import {FaFolder } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { IoPlay } from "react-icons/io5";



interface BaseItem {
  id: number;
  type: "people" | "files";
  name: string;
}

interface PeopleItem extends BaseItem {
  type: "people";
  image: string;
  status: "active" | "offline";
  statusText: string;
}

interface FileItem extends BaseItem {
  type: "files";
  icon: IconType;
  folderName?: string;
  lastEdit?: string;
  location?: string;  
}

export type DataItem = PeopleItem | FileItem;

export const dataList: DataItem[] = [
  {
    id: 1,
    type: "people",
    image: userOne,
    name: "Randall Johnsson",
    status: "active",
    statusText: "Active now",
  },
  {
    id: 2,
    type: "files",
    icon: FaFolder,
    name: "Random Michal Folder",
    location: "Photos",
    lastEdit: "Edited 12m ago",
  },
  {
    id: 3,
    type: "files",
    icon: FaImage,
    name: "crative_file_frandkies.jpg",
    location: "Photos/Assets",
    lastEdit: "Edited 12m ago",
  },
  {
    id: 4,
    type: "people",
    image: userTwo,
    name: "Kristinge Karand",
    status: "offline",
    statusText: "Active 2d ago",
  },
  {
    id: 5,
    type: "files",
    icon: IoPlay,
    name: "files_krande_michelle.avi",
    location: "Videos",
    lastEdit: "Added 12m ago",
  },
    {
    id: 6,
    type: "people",
    image: userThree,
    name: "Hariharan",
    status: "active",
    statusText: "Active now",
  },
 {
    id: 7,
    type: "files",
    icon: IoPlay,
    name: "Dots by Ooloi Labs",
    location: "Videos",
    lastEdit: "Added 25m ago",
  },
  {
    id: 8,
    type: "files",
    icon: FaImage,
    name: "John Doe.jpg",
    location: "Photos/Assets",
    lastEdit: "Edited 5m ago",
  },
];
