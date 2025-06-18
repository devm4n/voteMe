import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

export default function App() {
  const [isMoreAbout, setIsMoreAbout] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const [isUpVoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const [votes, setVotes] = useState({ id: [], up: [], down: [] });
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          "https://68506d13e7c42cfd1798a529.mockapi.io/users"
        );
        const initialVotes = {
          id: response.data.map(user => user.id),
          up: [],
          down: []
        };
        setVotes(initialVotes);
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUserData();
  }, [votes]);

  useEffect(() => {
    const putUserData = async () => {
      try {
        const updatedData = data.map((user) => {
          if (votes.up.includes(user.id)) {
            return { ...user, votes: user.votes + 1 };
          }
          if (votes.down.includes(user.id)) {
            return { ...user, votes: user.votes - 1 };
          }
          return user;
        });

        for (const user of updatedData) {
          await axios.put(
            `https://68506d13e7c42cfd1798a529.mockapi.io/users/${user.id}`,
            {
              votes: user.votes,
            }
          );
        }
      } catch {
        console.log();
      }
    };
    putUserData();
  },[data, votes]);

  const readMore = (userId) => {
    setIsMoreAbout(true);
    setCurrentUserId(userId);
  };

  const back = () => {
    setIsMoreAbout(false);
  };

  const upVote = async (userId) => {
    setIsUpVoted(true);
    setIsDownVoted(false);
    setVotes((prev) => ({ ...prev, up: [...prev.up, userId] }));
  };

  const downVote = (userId) => {
    setIsDownVoted(true);
    setIsUpVoted(false);
    setVotes((prev) => ({ ...prev, down: [...prev.down, userId] }));
  };

  return (
    <>
      <div className="main w-full min-h-screen bg-cyan-950 pb-6">
        <div className="greet p-2 pt-8 flex justify-center items-center">
          <h1
            className="text-5xl hover:shadow-cyan-600 hover:shadow-sm bg-cyan-800 p-4 rounded-lg text-cyan-500 text-center "
            style={{ fontFamily: "Lato" }}
          >
            Hello <span className="text-orange-400">friend.</span>
          </h1>
        </div>

        {data.map((user) => (
          <div
            key={user.id}
            className="card flex justify-center items-center my-6"
          >
            <div className="card-body hover:shadow-sm hover:shadow-emerald-200 flex flex-col justify-start p-2 items-start w-[400px] max-w-full bg-cyan-800 rounded-lg">
              <div className="title p-2">
                <h2
                  className="text-cyan-100"
                  style={{ fontFamily: "Nunito sans" }}
                >
                  {user.name}
                </h2>
              </div>
              <div className="about p-2">
                <p className="text-start text-cyan-200">
                  {user.about.split(" ").slice(0, 12).join(" ")}...
                </p>
              </div>
              <div className="action flex gap-2 p-2 text-orange-400 justify-between w-full">
                <div className="flex">
                  <div className="like mx-2 hover:bg-orange-300/10 p-1 hover:rounded-md">
                    <button onClick={() => upVote(user.id)}>
                      <ArrowBigUp
                        className={`${
                          votes.up.find((u) => u === user.id) && isUpVoted
                            ? "text-orange-400"
                            : "text-cyan-600"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="votes">
                    <h2 className="p-1">{user.votes}</h2>
                  </div>
                  <div className="like mx-2 hover:bg-orange-300/10 p-1 hover:rounded-md">
                    <button onClick={() => downVote(user.id)}>
                      <ArrowBigDown
                        className={`${
                          votes.down.find((u) => u === user.id) && isDownVoted
                            ? "text-orange-400"
                            : "text-cyan-600"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="more text-cyan-200 p-1 hover:text-cyan-400">
                  <button
                    className="active:scale-90"
                    onClick={() => readMore(user.id)}
                  >
                    Read More.
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isMoreAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className=" bg-cyan-900 rounded-lg p-6 shadow-xl w-96 flex flex-col items-center">
            <h2
              className="text-xl font-bold mb-4 text-cyan-100"
              style={{ fontFamily: "Lato" }}
            >
              {data.find((user) => user.id === currentUserId)?.name}
            </h2>
            <p className="text-cyan-200">
              {data.find((user) => user.id === currentUserId)?.about}
            </p>

            <div className="action flex text-orange-400 justify-between w-full">
              <div className="flex">
                <div className="like hover:bg-orange-300/10 py-2 p-2 hover:rounded-md">
                  <button onClick={upVote}>
                    <ArrowBigUp
                      className={`${
                        isUpVoted ? "text-orange-400" : "text-cyan-600"
                      }`}
                    />
                  </button>
                </div>
                <div className="votes">
                  <h2 className="p-2">
                    {data.find((user) => user.id === currentUserId)?.votes}
                  </h2>
                </div>
                <div className="like hover:bg-orange-300/10 py-2 p-2 hover:rounded-md">
                  <button onClick={downVote}>
                    <ArrowBigDown
                      className={`${
                        isDownVoted ? "text-orange-400" : "text-cyan-600"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="back active:scale-90 bg-cyan-500 rounded-md text-cyan-200 p-2 hover:bg-cyan-600 hover:text-cyan-400">
                <button className="" onClick={back}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
