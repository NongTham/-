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
  name: "guildMemberRemove",
  async execute(member) {
    // ตรวจสอบว่าผู้ใช้ถูกเชิญโดยใคร
    if (invitedUsersMap.has(member.user.id)) {
      const inviterData = invitedUsersMap.get(member.user.id);
      const inviterId = inviterData.inviter;

      // ตรวจสอบว่ายังมีผู้ถูกเชิญคนอื่นที่ยังอยู่ในเซิร์ฟเวอร์หรือไม่
      const guildMembers = await member.guild.members.fetch();
      const stillInvited = Array.from(invitedUsersMap.keys()).some((userId) => {
        const invitedUser = invitedUsersMap.get(userId);
        return invitedUser.inviter === inviterId && guildMembers.has(userId);
      });

      // ถ้าผู้ถูกเชิญทั้งหมดออกจากเซิร์ฟเวอร์แล้ว ให้ลด count ของผู้เชิญ
      if (!stillInvited) {
        if (invitedUsersMap.has(inviterId)) {
          let inviterInfo = invitedUsersMap.get(inviterId);

          // ลดจำนวน count ของผู้เชิญลง 1
          if (inviterInfo.count > 0) {
            inviterInfo.count -= 1;
          }

          // อัปเดตข้อมูลใน invitedUsersMap
          invitedUsersMap.set(inviterId, inviterInfo);

          // บันทึกการเปลี่ยนแปลงลงในไฟล์ JSON
          saveInvitedUsers(invitedUsersMap);

          console.log(
            `ผู้ถูกเชิญ ${member.user.id} ออกจากเซิร์ฟเวอร์ และ count ของผู้เชิญ ${inviterId} ถูกลดลงแล้ว`
          );
        }
      }

      // // ลบข้อมูลการเชิญของผู้ที่ออกจากเซิร์ฟเวอร์
      invitedUsersMap.delete(member.user.id);

      // บันทึกการเปลี่ยนแปลงลงในไฟล์ JSON
      saveInvitedUsers(invitedUsersMap);
    }
  },
};

