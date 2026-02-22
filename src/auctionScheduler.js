const cron = require("node-cron");
const Auction = require("../models/Auction");
const sendEmail = require("../utils/sendEmail");

cron.schedule("*/10 * * * *", async () => { // Runs every 10 minutes
    const expiredAuctions = await Auction.find({ endTime: { $lte: new Date() } });

    expiredAuctions.forEach(async (auction) => {
        const winner = await getAuctionWinner(auction._id);
        const participants = await getAuctionParticipants(auction._id);

        if (winner) {
            await sendEmail(winner.email, "Auction Success!", `Congratulations! You won the auction for ${auction.itemName}.`);
        }

        participants.forEach(async (user) => {
            await sendEmail(user.email, "Auction Result", `The auction for ${auction.itemName} has ended. The winner is ${winner.username}.`);
        });

        await Auction.findByIdAndDelete(auction._id); // Remove expired auction
    });
});

async function getAuctionWinner(auctionId) {
    // Fetch highest bidder logic
}

async function getAuctionParticipants(auctionId) {
    // Fetch all users who placed bids
}