import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Select, Button } from "antd";

function App() {
  const [inputDevices, setInputDevices] = useState([]);
  const [faceDeviceId, setFaceDeviceId] = useState("");
  const [backDeviceId, setBackDeviceId] = useState("");
  const [imgDataArr, setImgDataArr] = useState([]);
  const faceVideoRef = useRef(null);
  const backVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalName = useRef(null);
  const screenRef = useRef(null)
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      let arr = [];
      devices.forEach((device) => {
        let obj = {
          value: device.deviceId,
          kind: device.kind,
          label: device.label,
        };
        if (device.kind === "videoinput") {
          arr.push(obj);
        }
      });
      setInputDevices([...arr]);
    });
  }, []);

  const selectFaceInput = (e) => {
    setFaceDeviceId(e);
  };
  const playFaceInput = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { deviceId: faceDeviceId } })
      .then((stream) => {
        faceVideoRef.current.srcObject = stream;
        faceVideoRef.current.play();
      });
  };
  const selectBackInput = (e) => {
    setBackDeviceId(e);
  };
  const playBackInput = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { deviceId: backDeviceId } })
      .then((stream) => {
        backVideoRef.current.srcObject = stream;
        backVideoRef.current.play();
      });
  };
  const captureStare = useMemo(() => {
    return () => {
      setInterval(() => {
        const canvas = canvasRef.current;
         canvas.width = faceVideoRef.current.videoWidth;
        canvas.height = faceVideoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(faceVideoRef.current, 0, 0, canvas.width, canvas.height);
        const data1 = canvas.toDataURL("image/png");
        context.drawImage(backVideoRef.current, 0, 0, canvas.width, canvas.height);
        const data2 = canvas.toDataURL("image/png");
        context.drawImage(screenRef.current, 0, 0, canvas.width, canvas.height);
        const data3 = canvas.toDataURL("image/png");
        setImgDataArr((pre) => {
          return [...pre, [data1, data2, data3]];
        });
      }, 6 *1000)
    };
  }, [faceVideoRef, backVideoRef, screenRef])
  const selectPlayScreen = () => {
    navigator.mediaDevices
    .getDisplayMedia({ video: { width: 1920, height: 1080 }, audio: false })
    .then((stream) => {
      screenRef.current.srcObject = stream;
      screenRef.current.play();
    });
  }
  const sure = () => {
    backVideoRef.current.classList.add("fixed");
    faceVideoRef.current.classList.add("fixed2");
    screenRef.current.classList.add("fixed3");
    captureStare()
  }
  return (
    <>
      <div>
        <div>
          选择前置摄像头
          <Select
            style={{ width: "250px" }}
            options={inputDevices}
            onChange={selectFaceInput}
          ></Select>
          <Button type="primary" onClick={playFaceInput}>
            确定
          </Button>
        </div>
        <video ref={faceVideoRef}></video>
      </div>
      <div>
        <div>
          选择第二个摄像头
          <Select
            style={{ width: "250px" }}
            options={inputDevices}
            onChange={selectBackInput}
          ></Select>
          <Button type="primary" onClick={playBackInput}>
            确定
          </Button>
        </div>
        <video ref={backVideoRef}></video>
      </div>
      <div>
        <div>
          选择屏幕
          <Button type="primary" onClick={selectPlayScreen}>
            确定
          </Button>
        </div>
        <video ref={screenRef}></video>
      </div>
      <canvas id="canvas" style={{ display: "none" }} ref={canvasRef}></canvas>
      <Button type="primary" onClick={sure}>
        确定
      </Button>
      {imgDataArr.map((e) => {
        return (
          <div key={e[0]} style={{ display: "flex" }}>
            <img src={e[0]} alt="" style={{ width: "100px" }} />
            <img src={e[1]} alt="" style={{ width: "100px" }} />
            <img src={e[2]} alt="" style={{ width: "100px" }} />
          </div>
        );
      })}
    </>
  );
}

export default App;
