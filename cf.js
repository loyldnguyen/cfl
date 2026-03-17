// Script patch offset cho Crossfire Legends (non-jailbreak, TrollStore H5GG)
// Binary tên: crossfirelegends (không phải UnityFramework)

h5gg.require(7.9);  // Đảm bảo version hỗ trợ

var h5frida = h5gg.loadPlugin("H5GG.dylib");  
// Nếu lỗi load, thử tên khác hoặc kiểm tra trong H5GG plugin list (thường có sẵn ở bản mlgm66)

if (!h5frida) {
    alert("❌ Không load được H5GG plugin!\nKiểm tra H5GG TrollStore có plugin chưa (tải bản mới nếu thiếu).");
    throw "H5GG load failed";
}

// Tên binary chính xác cho game này
var binaryPath = "crossfirelegends";  // ← Đây là tên bạn cung cấp, thường là executable chính

// Danh sách offset + bytes từ bạn
var patches = [
    {offset: 0x73736F0, bytes: "0010281E"},
    {offset: 0x2D6E870, bytes: "20008052"},
    {offset: 0x3CFFAC0, bytes: "00008052"},
    {offset: 0x3E350AC, bytes: "21008052"},
    {offset: 0x3E350B0, bytes: "E041201EE103271EE203271E"},
    {offset: 0x311B394, bytes: "C0035FD6"},
    {offset: 0x30B34E0, bytes: "C0035FD6"},
    {offset: 0x3BF9BC4, bytes: "C0035FD6"},
    {offset: 0x9DE25C,  bytes: "C0035FD6"},
    {offset: 0x3D039E4, bytes: "00008052C0035FD6"},
    {offset: 0x82915C,  bytes: "00008052C0035FD6"},
    {offset: 0x37472F4, bytes: "00008052C0035FD6"},
    {offset: 0xECC5B8,  bytes: "00008052C0035FD6"},
    {offset: 0xECC5DC,  bytes: "00008052C0035FD6"},
    {offset: 0x3FD68D4, bytes: "00008052C0035FD6"},
    {offset: 0x3FD6A54, bytes: "00008052C0035FD6"},
    {offset: 0x3FD7830, bytes: "00008052C0035FD6"},
    {offset: 0x513C78,  bytes: "00008052C0035FD6"},
    {offset: 0x3FD7B9C, bytes: "C0035FD6"},
    {offset: 0x3FD75AC, bytes: "C0035FD6"},
    {offset: 0x3FD7CF4, bytes: "C0035FD6"},
    {offset: 0x1431A44, bytes: "00008052C0035FD6"}
];

var success = 0;
var fails = [];

for (var i = 0; i < patches.length; i++) {
    var p = patches[i];
    var rvaddr = p.offset;  // relative virtual address (offset trong binary)

    // Ưu tiên ActiveCodePatch (ổn định hơn cho code patch runtime)
    if (h5frida.ActiveCodePatch(binaryPath, rvaddr, p.bytes)) {
        console.log("✓ ActiveCodePatch OK: 0x" + p.offset.toString(16).toUpperCase());
        success++;
        continue;
    }

    // Fallback sang ApplyCodePatch nếu Active fail
    var result = h5frida.ApplyCodePatch(binaryPath, rvaddr, p.bytes);
    if (result === true || result === "" || result === undefined) {
        console.log("✓ ApplyCodePatch OK: 0x" + p.offset.toString(16).toUpperCase());
        success++;
    } else {
        console.log("✗ Fail 0x" + p.offset.toString(16).toUpperCase() + " → " + (result || "Unknown error"));
        fails.push("0x" + p.offset.toString(16).toUpperCase());
    }
}

var msg = "Patch hoàn tất!\nThành công: " + success + " / " + patches.length + "\n";
if (fails.length > 0) {
    msg += "Fail tại: " + fails.join(", ") + "\n";
    msg += "Nếu fail nhiều → thử:\n1. Restart game rồi chạy lại\n2. Kiểm tra binaryPath có đúng 'crossfirelegends' (case-sensitive)\n3. Dùng H5GG → Memory → list ranges, tìm module tên 'crossfirelegends' để confirm";
} else {
    msg += "Tất cả thành công! Restart game để áp dụng nếu cần.";
}

alert(msg);
console.log("Crossfire Legends patch: success " + success + ", fails: " + fails.length);
