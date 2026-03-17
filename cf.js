h5gg.require(7.9);  // hoặc cao hơn nếu bạn dùng bản mới

// Load plugin noJBpip (nó đã có sẵn trong .app của H5GG TrollStore)
var noJBpip = h5gg.loadPlugin("noJBpip", "noJBpip.dylib");
if (!noJBpip) {
    throw "❌ Không load được noJBpip.dylib!\nKiểm tra lại file trong .app của H5GG.";
}

alert("✅ noJBpip loaded!\nPlugin version: " + noJBpip.pluginVersion());

// Hàm patch (tương tự ActiveCodePatch, nhưng dùng API của noJBpip)
function patchOffset(moduleName, offset, bytes) {
    // noJBpip thường dùng API kiểu: patchCode hoặc applyPatch
    // Dựa theo bản mới nhất, thử dùng cách này (có thể tên hàm hơi khác, bạn test và adjust)
    var result = noJBpip.patchCode(moduleName, offset, bytes);
    
    if (result === true || result.indexOf("success") !== -1) {
        console.log("Patch OK: " + moduleName + " +0x" + offset.toString(16));
        return true;
    } else {
        alert("Patch fail tại offset 0x" + offset.toString(16) + "\nLỗi: " + result);
        return false;
    }
}

// THAY ĐỔI Ở ĐÂY: tên module/binary bạn muốn patch
// Thường là:
// - executable chính của game (tìm bằng h5gg.getRangesList("*"))
// - hoặc "UnityFramework" nếu game Unity
var targetModule = "crossfirelegends";   // ←←← thay ở đây nếu cần

var patches = [
    { offset: 0x73736F0,  bytes: "0010281E" },
    { offset: 0x2D6E870,  bytes: "20008052" },
    { offset: 0x3CFFAC0,  bytes: "00008052" },
    { offset: 0x3E350AC,  bytes: "21008052" },
    { offset: 0x3E350B0,  bytes: "E041201EE103271EE203271E" },
    { offset: 0x311B394,  bytes: "C0035FD6" },
    { offset: 0x30B34E0,  bytes: "C0035FD6" },
    { offset: 0x3BF9BC4,  bytes: "C0035FD6" },
    { offset: 0x9DE25C,   bytes: "C0035FD6" },
    { offset: 0x3D039E4,  bytes: "00008052C0035FD6" },
    { offset: 0x82915C,   bytes: "00008052C0035FD6" },
    { offset: 0x37472F4,  bytes: "00008052C0035FD6" },
    { offset: 0xECC5B8,   bytes: "00008052C0035FD6" },
    { offset: 0xECC5DC,   bytes: "00008052C0035FD6" },
    { offset: 0x3FD68D4,  bytes: "00008052C0035FD6" },
    { offset: 0x3FD6A54,  bytes: "00008052C0035FD6" },
    { offset: 0x3FD7830,  bytes: "00008052C0035FD6" },
    { offset: 0x513C78,   bytes: "00008052C0035FD6" },
    { offset: 0x3FD7B9C,  bytes: "C0035FD6" },
    { offset: 0x3FD75AC,  bytes: "C0035FD6" },
    { offset: 0x3FD7CF4,  bytes: "C0035FD6" },
    { offset: 0x1431A44,  bytes: "00008052C0035FD6" }
];

// Chạy patch
var successCount = 0;
for (var i = 0; i < patches.length; i++) {
    var p = patches[i];
    if (patchOffset(targetModule, p.offset, p.bytes)) {
        successCount++;
    }
}

alert("Hoàn tất!\nPatch thành công: " + successCount + " / " + patches.length + " offset\n\nNếu fail nhiều → kiểm tra tên module hoặc offset có còn đúng với version game hiện tại không.");
