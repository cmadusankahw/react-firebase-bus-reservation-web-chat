import React, { Component } from "react";
import { GiftedChat } from "react-web-gifted-chat";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";

const config = {
  apiKey: "AIzaSyALcAseCiRX-xHHlIBm95_VHH1BnCzIf8U",
  authDomain: "buzzbus-chat.firebaseapp.com",
  projectId: "buzzbus-chat",
  databaseURL: "https://buzzbus-chat-default-rtdb.firebaseio.com",
  storageBucket: "buzzbus-chat.appspot.com",
  messagingSenderId: "378097823505",
  appId: "1:378097823505:web:0bd19250900c24fb22a6b0",
  measurementId: "G-N8N4Z8B3WF",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const user = {
  email: "admin@buzzbus.com",
  password: "abc123",
};

export default class ChatView extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {},
      isAuthenticated: false,
    };
  }

  async signIn() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(googleProvider);
    } catch (error) {
      console.error(error);
    }
  }

  async signInWithEmail(user) {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password);
    } catch (error) {
      console.error(error);
    }
  }

  signOut() {
    firebase.auth().signOut();
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isAuthenticated: true, user });
        this.loadMessages();
      } else {
        this.setState({ isAuthenticated: false, user: {}, messages: [] });
      }
    });
  }

  loadMessages() {
    const callback = (snap) => {
      const message = snap.val();
      message.id = snap.key;
      const { messages } = this.state;
      messages.push(message);
      this.setState({ messages });
    };
    firebase.database().ref("/Messages/").on("child_added", callback);
  }

  renderPopup() {
    return (
      <Dialog open={!this.state.isAuthenticated}>
        <DialogTitle id="simple-dialog-title">Sign in</DialogTitle>
        <div>
          <div style={{ textAlign: "center", width: 400 }}>
            <br />
            <TextField
              style={{ width: "80%" }}
              id="email"
              label="Email"
              defaultValue={user.email}
            />
            <br />
            <TextField
              style={{ width: "80%" }}
              id="password"
              label="Password"
              defaultValue={user.password}
            />
            <br />
          </div>

          <List>
            <ListItem
              style={{ textAlign: "center", width: 400 }}
              button
              onClick={() => this.signInWithEmail(user)}
            >
              <ListItemText primary="Sign in with Email" />
            </ListItem>
            <hr />
            <ListItem
              style={{ textAlign: "center", width: 400 }}
              button
              onClick={() => this.signIn()}
            >
              <ListItemAvatar>
                <Avatar style={{ backgroundColor: "#eee" }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    height="30"
                    alt="G"
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Sign in with Google" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }

  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  onSend(messages) {
    for (const message of messages) {
      this.saveMessage(message);
    }
  }

  saveMessage(message) {
    message.user = {
      email: this.state.user.email,
      avatar: "",
      name: "Admin",
      _id: this.makeid(28),
    };
    return firebase
      .database()
      .ref("/Messages/")
      .push(message)
      .catch(function (error) {
        console.error("Error saving message to Database:", error);
      });
  }

  renderSignOutButton() {
    if (this.state.isAuthenticated) {
      return (
        <Button onClick={() => this.signOut()}>
          <IconButton edge="right" color="inherit" className={styles.signBtn}>
            <AccountCircle />
          </IconButton>
          Sign Out
        </Button>
      );
    }
    return null;
  }

  renderChat() {
    return (
      <GiftedChat
        user={this.chatUser}
        messages={this.state.messages.slice().reverse()}
        onSend={(messages) => this.onSend(messages)}
        renderUsernameOnMessage={true}
      />
    );
  }

  renderChannels() {
    return (
      <List>
        <ListItem button>
          <ListItemAvatar>
            <Avatar>B</Avatar>
          </ListItemAvatar>
          <ListItemText primary="BuzzBus Web Chat" />
        </ListItem>
      </List>
    );
  }

  renderChannelsHeader() {
    return (
      <AppBar color="inherit" position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            BuzzBus Chat
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    return (
      <>
        <div style={styles.topContainer}>
          {this.renderChannelsHeader()}
          <div style={styles.container}>
            {this.renderPopup()}
            <div style={styles.channelList}>{this.renderChannels()}</div>
            <div style={styles.chat}>{this.renderChat()}</div>
            <div style={styles.settings}>{this.renderSignOutButton()}</div>
          </div>
        </div>
      </>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    maxHeight: "50vh",
    minHeight: "50vh",
  },
  topContainer: {
    height: "90vh",
  },
  signBtn: {
    justifyContent: "right",
    alignSelf: "right",
  },
  channelList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    margin: 0,
    height: "80vh",
  },
  settings: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
};
