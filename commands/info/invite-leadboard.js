const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../database/invitedUsers.json");

// ฟังก์ชันอ่านข้อมูลจาก JSON
function loadInvitedUsers() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return new Map(JSON.parse(data)); // แปลง Array จาก JSON กลับเป็น Map
    } else {
        return new Map(); // ถ้าไฟล์ยังไม่มีอยู่ จะเริ่มต้นด้วย Map ว่าง
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite-leadboard")
        .setDescription("ตรวจสอบผู้ที่เชิญสมาชิกมากที่สุด 5 อันดับแรก"),
    async execute(interaction, client) {
        // โหลด invitedUsersMap เมื่อบอทเริ่มทำงาน
        let invitedUsersMap = loadInvitedUsers(); // โหลดข้อมูลจากไฟล์ JSON

        async function total() {
            // สร้าง Map สำหรับเก็บจำนวนเชิญที่นับตามผู้เชิญ
            let inviteCounts = new Map();

            // ลูปผ่าน invitedUsersMap เพื่อรวบรวมข้อมูลผู้เชิญและจำนวนเชิญ
            invitedUsersMap.forEach((value, key) => {
                const inviterId = value.inviter;
                const count = value.count;

                if (inviteCounts.has(inviterId)) {
                    inviteCounts.set(inviterId, inviteCounts.get(inviterId) + count);
                } else {
                    inviteCounts.set(inviterId, count);
                }
            });

            // แปลง inviteCounts เป็น array ของ objects สำหรับ leaderboard
            let userInvs = [];
            inviteCounts.forEach((count, inviterId) => {
                userInvs.push({ user: inviterId, invites: count });
            });

            return userInvs;
        }

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(message);

            await interaction.reply({ embeds: [embed] });
        }

        var leaderboard = await total();
        leaderboard.sort((a, b) => b.invites - a.invites);
        var output = leaderboard.slice(0, 10);

        var string = "";
        var num = 1;
        for (const value of output) {
            var member = await interaction.guild.members.fetch(value.user);
            string += `${num}. <@${member.user.id}> - ${value.invites} การเชิญ\n`;
            num++;
        }

        // ปรับปรุงการแสดงผล
        string = string || "ไม่มีข้อมูลการเชิญ";
        await sendMessage(
            `🌏 **อันดับผู้เชิญสูงสุดในเซิร์ฟเวอร์ (ดาวเด่น)**\n\n${string}`
        );
    },
};
