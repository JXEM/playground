import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import Youtube from "react-youtube";
import styled from "styled-components";
// import Slider from "../../Components/Slider";
import Slider from "@material-ui/core/Slider";
import { getVideoInfo } from "../../utils";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ControlPanel = styled.div`
  width: 50%;
  height: 500px;
  border: 2px solid red;
  padding: 0 20px;
`;

const PlayControl = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  div {
    font-size: 32px;
    &:hover {
      cursor: pointer;
    }
  }
  svg {
    width: 30px;
    height: 30px;
    fill: ${(props) => (props.looping ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.3)")};
  }
`;

const Button = styled.div`
  width: 200px;
  height: 50px;
  margin: 0 auto;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.1s ease-in;
  &:hover {
    cursor: pointer;
    transform: translateY(-5px);
  }
`;

const SaveList = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SavedItem = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
    background-color: yellow;
  }
`;

const Watch = ({ location }) => {
  const [query, setQuery] = useState({});
  const [part, setPart] = useState([0, 0]);
  const [partList, setPartList] = useState([]);
  const [max, setMax] = useState(0);
  const [videoStatus, setVideoStatus] = useState("stop");
  const [looping, setLooping] = useState(false);

  const youtubeRef = useRef();
  const sliderRef = useRef();
  const loopRef = useRef();

  useEffect(() => {
    const { search } = location;
    const newQuery = {};
    search
      .slice(1)
      .split(/[?&]/g)
      .forEach((q) => {
        const t = q.split("=");
        newQuery[t[0]] = t[1];
      });
    setQuery(newQuery);
  }, [location]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await getVideoInfo(query.v);
  //     console.log(data);
  //   }
  //   if (!!query.v) {
  //     fetchData();
  //   }
  // }, [query.v]);

  const handleSliderChange = (e, newValue) => {
    setPart(newValue);
    if (looping) {
      clearInterval(loopRef.current);
      loopRef.current = setInterval(handleLoop, 1000);
    }
  };

  const secondToTime = (value, idx) => {
    const min = `${Math.floor(value / 60)}`.padStart(2, "0");
    const sec = `${value % 60}`.padStart(2, "0");
    return min + ":" + sec;
  };

  const handleSavePart = () => {
    setPartList([...partList, part]);
  };

  const handleLoadPart = (newPart) => {
    setPart(newPart);
    youtubeRef.current.internalPlayer.seekTo(newPart[0]);
  };

  const handlePlayer = (command) => {
    const yp = youtubeRef.current.internalPlayer;
    switch (command) {
      case "play":
        setVideoStatus(command);
        yp.playVideo();
        break;

      case "stop":
        setVideoStatus(command);
        yp.stopVideo();
        break;

      case "pause":
        setVideoStatus(command);
        yp.pauseVideo();
        break;

      default:
        break;
    }
  };

  const handleMakePart = async (command) => {
    const newTime = Math.floor(
      await youtubeRef.current.internalPlayer.getCurrentTime()
    );
    if (command === "start") {
      if (newTime <= part[1]) {
        setPart([newTime, part[1]]);
      } else {
        setPart([newTime, max]);
      }
    } else if (command === "end") {
      if (part[0] <= newTime) {
        setPart([part[0], newTime]);
      } else {
        setPart([0, newTime]);
      }
    }
  };

  const handleLoop = async () => {
    const yp = youtubeRef.current.internalPlayer;
    const newTime = Math.floor(await yp.getCurrentTime());
    if (newTime > part[1]) {
      yp.seekTo(part[0]);
    } else if (newTime < part[0]) {
      yp.seekTo(part[0]);
    }
  };

  return (
    <Wrapper>
      <Youtube
        ref={youtubeRef}
        videoId={query.v}
        opts={{ playerVars: { controls: 1 } }}
        onPlay={() => {
          setVideoStatus("play");
          console.log("play");
          if (looping) {
            clearInterval(loopRef.current);
            loopRef.current = setInterval(handleLoop, 1000);
          }
        }}
        onStop={() => {
          setVideoStatus("stop");
          if (looping) {
            clearInterval(loopRef.current);
          }
        }}
        onPause={() => {
          setVideoStatus("pause");
          if (looping) {
            clearInterval(loopRef.current);
          }
        }}
        onStateChange={(e) => {
          if (max === 0) {
            const newMax = Math.floor(e.target.getDuration());
            setMax(newMax);
            setPart([0, newMax]);
          }
          if (looping) {
            clearInterval(loopRef.current);
          }
        }}
      />
      <ControlPanel>
        <PlayControl looping={looping}>
          {videoStatus === "play" ? (
            <div
              onClick={() => {
                handlePlayer("pause");
              }}
            >
              | |
            </div>
          ) : (
            <div
              onClick={() => {
                handlePlayer("play");
              }}
            >
              ▶︎
            </div>
          )}
          <div
            onClick={() => {
              handlePlayer("stop");
            }}
          >
            ◼︎
          </div>
          <div
            onClick={() => {
              handleMakePart("start");
            }}
          >
            [
          </div>
          <div
            onClick={() => {
              handleMakePart("end");
            }}
          >
            ]
          </div>
          <div
            onClick={() => {
              if (looping) {
                setLooping(false);
                clearInterval(loopRef.current);
              } else {
                setLooping(true);
                clearInterval(loopRef.current);
                loopRef.current = setInterval(handleLoop, 1000);
              }
            }}
          >
            {looping ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M18 13v5h-5l1.607-1.608c-3.404-2.824-5.642-8.392-9.179-8.392-2.113 0-3.479 1.578-3.479 4s1.365 4 3.479 4c1.664 0 2.86-1.068 4.015-2.392l1.244 1.561c-1.499 1.531-3.05 2.831-5.259 2.831-3.197 0-5.428-2.455-5.428-6s2.231-6 5.428-6c4.839 0 7.34 6.449 10.591 8.981l1.981-1.981zm.57-7c-2.211 0-3.762 1.301-5.261 2.833l1.244 1.561c1.156-1.325 2.352-2.394 4.017-2.394 2.114 0 3.48 1.578 3.48 4 0 1.819-.771 3.162-2.051 3.718v2.099c2.412-.623 4-2.829 4-5.816.001-3.546-2.231-6.001-5.429-6.001z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M18 13v5h-5l1.607-1.608c-3.404-2.824-5.642-8.392-9.179-8.392-2.113 0-3.479 1.578-3.479 4s1.365 4 3.479 4c1.664 0 2.86-1.068 4.015-2.392l1.244 1.561c-1.499 1.531-3.05 2.831-5.259 2.831-3.197 0-5.428-2.455-5.428-6s2.231-6 5.428-6c4.839 0 7.34 6.449 10.591 8.981l1.981-1.981zm.57-7c-2.211 0-3.762 1.301-5.261 2.833l1.244 1.561c1.156-1.325 2.352-2.394 4.017-2.394 2.114 0 3.48 1.578 3.48 4 0 1.819-.771 3.162-2.051 3.718v2.099c2.412-.623 4-2.829 4-5.816.001-3.546-2.231-6.001-5.429-6.001z" />
              </svg>
            )}
          </div>
        </PlayControl>
        <Slider
          value={part}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          onChange={handleSliderChange}
          valueLabelFormat={secondToTime}
          max={max}
          min={0}
          ref={sliderRef}
        />
        <Button onClick={handleSavePart}>Save</Button>
        <SaveList>
          {partList.map((part, idx) => {
            return (
              <SavedItem
                key={idx}
                onClick={() => {
                  handleLoadPart(part);
                }}
              >
                {secondToTime(part[0])} - {secondToTime(part[1])}
              </SavedItem>
            );
          })}
        </SaveList>
      </ControlPanel>
    </Wrapper>
  );
};

export default withRouter(Watch);
