import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick, onSubmit }) {
  return (
    <button className="button" onClick={onClick} onSubmit={onSubmit}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    //setSelectedFriend(friend);
    // If the current friend again clicked that will be null "closed" else it will be a ne friend open
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddNewFriend={handleAddFriend} />}
        <Button onClick={() => setShowAddFriend(!showAddFriend)}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {/*This means if selected friends from Friend list is not selected yet, form would not display itself */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  // Choose the appropriate balance message

  const isSelected = selectedFriend?.id === friend.id;
  console.log(isSelected);

  let balanceMessage;
  if (friend.balance < 0) {
    balanceMessage = (
      <p className="red">
        You owe {friend.name} {Math.abs(friend.balance) + "€"}
      </p>
    );
  } else if (friend.balance === 0) {
    balanceMessage = <p>You and {friend.name} are even</p>;
  } else {
    balanceMessage = (
      <p className="green">
        {friend.name} owes you {friend.balance} €
      </p>
    );
  }

  return (
    <>
      <li>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3> <br />
        <span>{balanceMessage}</span>
        <Button onClick={() => onSelectFriend(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </>
  );
}

function FormAddFriend({ onAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function setFriendName(event) {
    let name = event.target.value;
    setName(name);
  }

  function setFriendImage(event) {
    let picture = event.target.value;
    setImage(picture);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddNewFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label htmlFor="">Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setFriendName(event)}
        />
        <label htmlFor="">Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(event) => setFriendImage(event)}
        />
      </form>

      <div>
        <Button type="submit" className="button" onClick={handleSubmit}>
          Add
        </Button>
      </div>
    </>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("you");

  const total = bill - myExpense;

  function addBill(event) {
    const bill = event.target.value;
    setBill(bill);
  }

  function addExpense(event) {
    const expense = +event.target.value; // Unary operator that transform from string to number type
    const currentBill = +bill;
    // Added logic so if the bill for example is 200€ my expanse can be maximum 200€ so it doesn't make sense that expense is above the bill
    setMyExpense(expense > currentBill ? currentBill : expense);
  }

  function handleSubmit(e) {
    console.log("Form submited");
    e.preventDefault();

    if (!bill || !myExpense) return;
    onSplitBill(total);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value</label>
      <input type="text" value={bill} onChange={(event) => addBill(event)} />

      <label>Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(event) => addExpense(event)}
      />

      <label>Friend expense</label>
      <input type="text" value={total} readOnly />

      <label>Who is paying the bill</label>
      <select
        name=""
        id=""
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="You">You</option>
        <option value="user">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
