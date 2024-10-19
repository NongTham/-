const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../database/invitedUsers.json');

function loadInvitedUsers() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return new Map(JSON.parse(data)); // แปลง Array กลับมาเป็น Map
    } else {
        return new Map();
    }
}

function saveInvitedUsers(map) {
    const data = JSON.stringify([...map]); // แปลง Map เป็น Array ก่อน
    fs.writeFileSync(filePath, data);
}

let invitedUsersMap = loadInvitedUsers(); // โหลดข้อมูลเมื่อบอทเริ่มทำงาน

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        // ดึงข้อมูลเชิญจากเซิร์ฟเวอร์
        const invites = await member.guild.invites.fetch();

        // ค้นหาการเชิญที่ใช้และผู้เชิญไม่ใช่ตัวสมาชิกที่เพิ่งเข้ามา
        const invite = invites.find((i) => i.uses > 0);

        if (invite && invite.inviter.id !== member.user.id) {
            // ดึงข้อมูลผู้เชิญจาก invitedUsersMap ถ้ามีอยู่แล้ว
            let inviterData = invitedUsersMap.get(invite.inviter.id) || { count: 0 };

            // เพิ่ม count
            inviterData.count += 1;

            // บันทึกข้อมูลว่าใครเชิญใครและจำนวน count
            invitedUsersMap.set(member.user.id, {
                inviter: invite.inviter.id,
                count: inviterData.count,
            });

            // บันทึกการเปลี่ยนแปลงลงในไฟล์ JSON
            saveInvitedUsers(invitedUsersMap);

            console.log(
                `ผู้ใช้ ${member.user.username} ถูกเชิญโดย ${invite.inviter.username}, จำนวนเชิญ: ${inviterData.count}`
            );
        }
    },
};

