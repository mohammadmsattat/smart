import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  GetOneProject,
  UpdateOneProject,
} from "../../Store/Requests/ProjectsRequests";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const UseUpdateProject = (id) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  //service  variabels
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const run = async () => {
      await dispatch(GetOneProject(id));
    };
    run();
  }, []);

  const project = useSelector((state) => state.ProjectsSlice.getoneproject);

  useEffect(() => {
    if (project.data) {
      setImg(project.data.data.imageCover);
      setName(project.data.data.name);
      setDescription(project.data.data.description);
    }
  }, [project]);

  //when image change save it
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImg(URL.createObjectURL(event.target.files[0]));
      setSelectedFile(event.target.files[0]);
    }
  };

  //to change name state
  const onChangeName = (event) => {
    setName(event.target.value);
  };
  //to change description state
  const onChangeDecription = (event) => {
    setDescription(event.target.value);
  };
  //to change file state
  const onChangeImage = (event) => {
    onImageChange(event);
  };

  //get data from store
  const response = useSelector((state) => state.ProjectsSlice.updateProject);
  const Loading = useSelector((state) => state.ProjectsSlice.UpdateLoading);

  //save data in database
  const handelupdate = async (event) => {
    event.preventDefault();

    if (name === "" || description === "") {
      toast.error("Please complete all fields");
      return;
    }

    // Create FormData object
    const formData = {
      name: name,
      description: description,
    };
    // Log FormData contents

    // Dispatch the thunk
    await dispatch(UpdateOneProject({ id, formData }));
  };

  useEffect(() => {
    if (Loading === false) {
      console.log(response);

      if (response.status === 200) {
          toast.success("service updated successfully");
        navigate("/admin/manegment-service");
        window.location.reload(false);
      }
    }
  }, [Loading]);

  return {
    img,
    name,
    onChangeName,
    onChangeImage,
    setImg,
    description,
    onChangeDecription,
    onImageChange,
    handelupdate,
    response,
    Loading,
  };
};
