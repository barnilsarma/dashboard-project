import styles from "./Home.module.scss";
import { useState, useEffect } from "react";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [roomPopup, setRoomPopup] = useState(false);
    const [room, setRoom] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [rooms, setRooms] = useState([]); // ✅ Fix: Initialized as an empty array

    const openRoomPopup = (e) => {
        e.preventDefault();
        if (loggedIn || localStorage.getItem("email")) setRoomPopup(true);
        else toast.message("Please Login to create a dashboard!!");
    };

    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/${localStorage.getItem("userId")}`);
                console.log(res);

                if (res.data && res.data.msg && Array.isArray(res.data.msg.Room)) {
                    setRooms(res.data.msg.Room);
                } else {
                    setRooms([]); // ✅ Fix: Prevents undefined state
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
                toast.error("Error fetching dashboards!!");
                setRooms([]); // ✅ Handle errors gracefully
            }
        }

        if (localStorage.getItem("email")) {
            toast.promise(fetchRooms(), {
                loading: "Fetching your dashboards...",
                success: "Completed",
                error: "Error fetching dashboards!!"
            });
        }
    }, [loggedIn]);

    const createRoom = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                axios.post(`${import.meta.env.VITE_API_URL}/api/v1/room`, {
                    name: room,
                    userId: localStorage.getItem("userId")
                }),
                {
                    loading: "Creating Dashboard...",
                    success: "Successfully created dashboard!",
                    error: "Error in creating dashboard!!"
                }
            );
            fetchRooms(); // ✅ Fix: Refetch rooms after creating a new one
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("email");
        setLoggedIn(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, provider);

            if (result.user && result.user.email) {
                const userEmail = result.user.email.toLowerCase();
                const name = result.user.displayName;

                const createUser = async () => {
                    try {
                        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user`);
                        const users = response.data;

                        let userId = null;
                        users.msg.forEach((item) => {
                            if (item.email === userEmail) {
                                userId = item.id;
                                localStorage.setItem("userId", item.id);
                            }
                        });

                        if (!userId) {
                            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user`, {
                                name: name,
                                email: userEmail
                            });
                            userId = res.data.msg.id;
                            localStorage.setItem("userId", userId);
                        }

                        localStorage.setItem("email", userEmail);
                        setLoggedIn(true);
                    } catch (error) {
                        console.error("Error fetching/creating user:", error);
                        throw error;
                    }
                };

                await toast.promise(createUser(), {
                    loading: "Registering user....",
                    success: "User successfully registered!!",
                    error: "Error in registering user!!"
                });
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <>
            {roomPopup && (
                <div className={styles.roomPopup}>
                    <form className={styles.roomForm}>
                        <h1>Create your Dashboard</h1>
                        <div className={styles.fieldCont}>
                            <h1>Name of your Dashboard</h1>
                            <input type="text" onChange={(e) => setRoom(e.target.value)} />
                        </div>
                        <button className={styles.createBtn} onClick={createRoom}>
                            CREATE
                        </button>
                        <button onClick={()=>setRoomPopup(false)}>CLOSE</button>
                    </form>
                </div>
            )}
            <div className={styles.Home}>
                <div className={styles.logoCont}>
                    <img src="https://res.cloudinary.com/dhry5xscm/image/upload/v1739179119/portfolio/NEXUS_MEDIA-removebg-preview_ukxdug.png" alt="nexus logo" className={styles.logo} />
                </div>
                <div className={styles.Hero}>
                    <p>Welcome to Nexus Media, your one-stop destination for maintaining dashboards and tasks. We provide you with a seamless experience in task scheduling, task division, and much more.</p>
                    <button className={styles.roomCreateBtn} onClick={openRoomPopup}>
                        CREATE YOUR ROOM
                    </button>
                    {!localStorage.getItem("email") ? (
                        <button className={styles.loginBtn} onClick={handleLogin}>
                            LOGIN
                        </button>
                    ) : (
                        <button className={styles.loginBtn} onClick={handleLogout}>
                            LOGOUT
                        </button>
                    )}
                </div>
                <div className={styles.roomCont}>
                    <h1>Your Dashboards</h1>
                    <div className={styles.innerCont}>
                        {rooms.length > 0 ? (
                            rooms.map((item) => (
                                <div key={item.id}>
                                    <Link to={`/dashboard/${item.id}`}>{item.name}</Link>
                                </div>
                            ))
                        ) : (
                            <p>No dashboards found</p> // ✅ Fix: Show message if no dashboards exist
                        )}
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default Home;
