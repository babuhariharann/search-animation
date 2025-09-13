import styles from "../assets/styles/noData.module.css";
import { TbFileUnknown } from "react-icons/tb";

const NoData = () => {
  return (
    <div className={styles.container}>
      <TbFileUnknown fontSize={40} />
      <p className={styles.text}>No data</p>
    </div>
  );
};

export default NoData;
