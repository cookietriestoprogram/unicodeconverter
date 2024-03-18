var conversions = [];

function valid_unicode(i) {
  return /^[0-9A-Fa-f]{4,6}$/u.test(i);
}

function valid_UTF16(utf16Text) {
  // Regular expression pattern to match valid UTF-16 encoded characters
  return /^[0-9A-Fa-f]{1,8}$/u.test(utf16Text);
}

function changeName() {
  var translate = document.getElementById("toggle").checked;
  var btn = document.getElementById("submit-btn");

  var title = document.getElementById("title");

  if (!translate) {
    title.textContent = "UTF Translator";
    btn.textContent = "Translate";
  } else {
    title.textContent = "Unicode Converter";
    btn.textContent = "Convert";
  }
}

function convert() {
  var translate = document.getElementById("toggle").checked;
  var unicodeInput = document.getElementById("unicode").value;
  let utf16Input = document.getElementById("utf16").value;

  if (translate == false) {
    if (
      !valid_unicode(unicodeInput) ||
      (utf16Input != "" && unicodeInput == "") // only allow utf translate when toggled
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid Unicode character!",
      });
      return;
    }
  } else {
    //UTF-16 valid checker
    if (!valid_UTF16(utf16Input) || utf16Input == "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid UTF-16 character!",
      });
      return;
    }

    // UTF-16 to Unicode
    if (utf16Input != "") {
      var utf16 = parseInt(utf16Input, 16);
      if (utf16 <= 0xffff) {
        utf16 = utf16.toString(16);
        var unicodeRep = utf16.replace(/^0+/, "");
      } else {
        var unicodeRep = translateUTF16(utf16);
      }

      document.getElementById("unicode").value = "U+" + unicodeRep;

      conversions.push({
        unicode: unicodeRep,
        utf8: "----",
        utf16: utf16Input,
        utf32: "----",
      });

      updateRecommendations();

      return;
    }
  }

  // UNICODE to UTF
  var codepoint = parseInt(unicodeInput, 16);
  var utf8 = convertToUTF8(codepoint);
  var utf16 = convertToUTF16(codepoint);

  document.getElementById("utf8").value = utf8;
  document.getElementById("utf16").value = utf16;
  document.getElementById("utf32").value =
    "0x " + codepoint.toString(16).padStart(8, "0");

  conversions.push({
    unicode: unicodeInput,
    utf8: utf8,
    utf16: utf16,
    utf32: "0x " + codepoint.toString(16).padStart(8, "0"),
  });

  updateRecommendations();
}

function updateRecommendations() {
  var recommendationsDiv = document.getElementById("recommendations");
  recommendationsDiv.innerHTML = "";

  var uniqueRecommendations = new Set();

  conversions.forEach(function (conv) {
    if (!uniqueRecommendations.has(conv.unicode)) {
      var recommendation = document.createElement("div");
      recommendation.className = "recommendation";
      recommendation.textContent =
        "Unicode: " +
        conv.unicode +
        " | UTF-8: " +
        conv.utf8 +
        " | UTF-16: " +
        conv.utf16 +
        " | UTF-32: " +
        conv.utf32;
      recommendation.onclick = function () {
        document.getElementById("unicode").value = conv.unicode;
        document.getElementById("utf8").value = conv.utf8;
        document.getElementById("utf16").value = conv.utf16;
        document.getElementById("utf32").value = conv.utf32;
      };

      recommendationsDiv.appendChild(recommendation);
      uniqueRecommendations.add(conv.unicode);
    }
  });
}

function translateUTF16(utf16) {
  const upper = Math.floor(utf16 / 0x10000) - 0xd800;
  const lower = (utf16 % 0x10000) - 0xdc00;

  const unicodeCodePoint = (upper << 10) + lower + 0x10000;

  return unicodeCodePoint.toString(16);
}

function convertToUTF8(codepoint) {
  if (codepoint <= 0x7f) {
    return "0x " + codepoint.toString(16).padStart(2, "0");
  } else if (codepoint <= 0x7ff) {
    return (
      "0x " +
      ((codepoint >> 6) + 0xc0).toString(16).padStart(2, "0") +
      " " +
      ((codepoint & 0x3f) + 0x80).toString(16).padStart(2, "0")
    );
  } else if (codepoint <= 0xffff) {
    return (
      "0x " +
      ((codepoint >> 12) + 0xe0).toString(16).padStart(2, "0") +
      " " +
      (((codepoint >> 6) & 0x3f) + 0x80).toString(16).padStart(2, "0") +
      " " +
      ((codepoint & 0x3f) + 0x80).toString(16).padStart(2, "0")
    );
  } else {
    return (
      "0x " +
      ((codepoint >> 18) + 0xf0).toString(16).padStart(2, "0") +
      " " +
      (((codepoint >> 12) & 0x3f) + 0x80).toString(16).padStart(2, "0") +
      " " +
      (((codepoint >> 6) & 0x3f) + 0x80).toString(16).padStart(2, "0") +
      " " +
      ((codepoint & 0x3f) + 0x80).toString(16).padStart(2, "0")
    );
  }
}

function convertToUTF16(codepoint) {
  if (codepoint <= 0xffff) {
    return "0x " + codepoint.toString(16).padStart(4, "0");
  } else {
    var highSurrogate = Math.floor((codepoint - 0x10000) / 0x400) + 0xd800;
    var lowSurrogate = ((codepoint - 0x10000) % 0x400) + 0xdc00;
    return (
      "0x " +
      highSurrogate.toString(16).padStart(4, "0") +
      " " +
      lowSurrogate.toString(16).padStart(4, "0")
    );
  }
}
