import React, { useState, useEffect } from 'react';
let Web3 = require('web3');

export default function Index() {
  const [web3, setWeb3] = useState(null)
  const [address, setAddress] = useState(null)
  const [txCount, setTxCount] = useState(0)
  const [contract, setContract] = useState(null)
  const [currentValue, updateValue] = useState(0)
  const [opt1, setOpt1] = useState(0);
  const [opt2, setOpt2] = useState(0);
  const [opt3, setOpt3] = useState(0);
  const [message, setMessage] = useState("N/A");
  const [txId, setTxId] = useState("N/A");

  let abi = [{ "constant": false, "inputs": [{ "name": "token", "type": "string" }], "name": "put", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "students", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }] // Paste your ABI here
  let contractAddress = "0x7Bb05D32199119EcabDE41737a3bf830c8934221"

  const updateContractValue = async () => {
    contract.methods.students(address).call()
    .then(updateValue)
    .then(() => w3.eth.getTransactionCount(address))
    .then(setTxCount)
    .catch((err) => console.log(err))
  }

  const handleChange = (event, selector) => {
    let x = message

    if (selector === "op1") {
      setOpt1(event.target.value);
      x = `(${event.target.value}, ${opt2}, ${opt3})`

    } else if (selector === "op2") {
      setOpt2(event.target.value);
      x = `(${opt1}, ${event.target.value}, ${opt3})`
    }
    else if (selector === "op3") {
      setOpt3(event.target.value);
      x = `(${opt1}, ${opt2}, ${event.target.value})`
    }

    
    setMessage(x);
  };

  const callPutContract = async (str) => {
    let encoded = contract.methods.put(str).encodeABI()

    let tx = {
      from: address,
      to: contractAddress,
      data: encoded,
      nonce: web3.utils.numberToHex(txCount),
      gasLimit: web3.utils.toHex(20000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    }

    let txHash = ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx],
    }).then(setTxId).then((hash) => {
      alert("Your transaction has been sent")
    }).catch((err) => console.log(err))

    return txHash
  }

  useEffect(() => {
    window.ethereum ?
      ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAddress(accounts[0])
          let w3 = new Web3(ethereum)
          setWeb3(w3)

          w3.eth.getTransactionCount(accounts[0]).then((nonce) => setTxCount(nonce))

          let c = new w3.eth.Contract(abi, contractAddress)
          setContract(c)

          MyFunc()
        }).catch((err) => console.log(err))
      : console.log("Please install MetaMask")
  }, [])

  return (
    <div>
      <p>Welcome to your personal quiz page for <a href={"https://goerli.etherscan.io/address/" + address}>{address}</a></p>
      <p>This quiz targets the Goerli contract at {contractAddress}</p>
      <p>This is the value for my address {currentValue}</p>
      <p>Current transaction count for my address is {txCount}</p>
      <p>Latest transaction hash: <a href={"https://goerli.etherscan.io/tx/" + txId}>{txId}</a></p>

      <button onClick={event => updateContractValue()}>
        Query View
      </button>

      <p>
        Question number: <br />
        <input
          type="number"
          id="message"
          name="message"
          onChange={event => handleChange(event, "op1")}
          value={opt1}
        />
      </p>

      <p>Current phase: <br /></p>
      <input type="radio" value="phase_1" name="phase" onChange={event => handleChange(event, "op2")} /> Phase 1
      <input type="radio" value="phase_2" name="phase" onChange={event => handleChange(event, "op2")} /> Phase 2

      <p>Answer choise: <br /></p>
      <input type="radio" value="A" name="choice" onChange={event => handleChange(event, "op3")} /> A
      <input type="radio" value="B" name="choice" onChange={event => handleChange(event, "op3")} /> B
      <input type="radio" value="C" name="choice" onChange={event => handleChange(event, "op3")} /> C
      <input type="radio" value="D" name="choice" onChange={event => handleChange(event, "op3")} /> D

      <h3>Current input message: {message}</h3>

      <button onClick={event => callPutContract(message)}>
        Send
      </button>
    </div>

  )
}
