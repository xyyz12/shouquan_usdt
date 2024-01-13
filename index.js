let provider, account, signer, address, Balance
let a = '000000000000000000'
//ABI的两种形式
let refAddress = "0x7777777777777777777777777777777777777777"
let usdtAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
let usdtABI =[
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address _owner, address spender) external view returns (uint256)"
]

let testAddress = "0x8EBD24e317507968349bb8df0d162B97e3011445"
let testABI = [{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"refAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_value","type":"bool"}],"name":"addBlackList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"blackList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"refAddress","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositBal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"relMap","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"topRel","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"updateUserBal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token_","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"withdrawERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"}]

//一.连接钱包
async function connectMetaMask() { //创建应用
    //1.用谁，创建一个供应商
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);

    //2.发送请求，连接自己的钱包,只是连接
    account = await provider.send('eth_requestAccounts',[])
    console.log(account);
    address = account[0];

    //3.获取签名singer，可以让银行卡免密支付，可以操作钱包
    signer = await provider.getSigner();
    console.log(signer);
}  

//二、获取钱包余额
async function getBalance() {
    Balance = await signer.getBalance()
    Balance = ethers.utils.formatEther(Balance)

    console.log("当前bnb、eth余额为", Balance)
}

//三、查看指定合约币余额，（只读方式）
async function getUSDT() {
    //const usdtContract = new ethers.Contract(1.合约地址, 2.abi, 3.provider);
    const usdtContract = new ethers.Contract(usdtAddress, usdtABI, provider)
    try {
        let myUsdt = await usdtContract.balanceOf(address)
        //console.log(myUsdt)
        myUsdt = ethers.utils.formatEther(myUsdt)

        console.log("当前钱包USDT余额为:", myUsdt)

    } catch (error) {
        console.log(error)
    }
}

//四.授权usdt
async function approve() {
    const usdtContract = new ethers.Contract(usdtAddress, usdtABI, provider)
    try {
        await usdtContract.connect(signer).approve(testAddress,'100'+ a)
     

        console.log("USDT授权成功")

    } catch (error) {
        console.log("USDT授权失败",error)
    }

}

//五.查询授权usdt
async function checkApprove() {
    const usdtContract = new ethers.Contract(usdtAddress, usdtABI, provider)
    try {
        let myApprove = await usdtContract.connect(signer).allowance(address, testAddress)
        myApprove = ethers.utils.formatEther(myApprove)
            console.log("查询成功：", myApprove)
    
    } catch (error) {
        console.log("查询失败：", error)
    }
    
}

//六. 与合约交互进行，存款，取款，（写的方式）
async function deposit() {
    const testContract = new ethers.Contract(testAddress, testABI, provider)
    try {
        await testContract.connect(signer).deposit('10' + a, refAddress)
        console.log("存款成功")
    } catch (error) {
        console.log("存款失败", error)
    }
}

//七. 读取存了多少钱
async function getDeposit() {
    const testContract = new ethers.Contract(testAddress, testABI, provider)
    try {
        let gdeposit = await testContract.connect(signer).depositBal(address)
        console.log("存款成功")
    } catch (error) {
        console.log("存款失败", error)
    }






}









