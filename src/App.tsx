import { Route, Routes } from "react-router-dom";
import Task from "./pages/Task";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Task />} />
      </Routes>
    </div>
  );
};

export default App;
