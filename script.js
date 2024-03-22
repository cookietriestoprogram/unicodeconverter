var conversions = [];

function valid_unicode(i) {
  return /^[0-9A-Fa-f]{4,6}$/u.test(i);
}

function valid_UTF16(utf16Text) {
  // Regular expression pattern to match valid UTF-16 encoded characters
  return /^[0-9A-Fa-f]{1,8}$/u.test(utf16Text);
}

function clearInputs(){
  document.getElementById("unicode").value = "";
  document.getElementById("utf8").value = "";
  document.getElementById("utf16").value = "";
  document.getElementById("utf32").value = "";
  document.getElementById("utf8steps").innerHTML = "" ;
  document.getElementById("utf16steps").innerHTML = "" ;
}

function changeName() {
  clearInputs()

  let unicodeInput = document.getElementById("unicode");
  let utf16Input = document.getElementById("utf16")
  let utf8Input = document.getElementById("utf8")
  let utf32Input = document.getElementById("utf32")


  var translate = document.getElementById("toggle").checked;
  var btn = document.getElementById("submit-btn");

  var title = document.getElementById("title");

  if (!translate) {
    title.textContent = "UTF Translator";
    btn.textContent = "Translate";
    utf16Input.placeholder = "Ex: D803DFFF";
    utf8Input.placeholder = "Ex: F090BFBF"
    utf32Input.placeholder = "Ex: 00010FFF"
    unicodeInput.disabled = true
    unicodeInput.placeholder = ""

  } else {
    unicodeInput.disabled = false
    title.textContent = "Unicode Converter";
    btn.textContent = "Convert";
    
    unicodeInput.placeholder = "Enter Unicode (e.g., 20AC)"
    utf16Input.placeholder = "";
    utf8Input.placeholder = "";
    utf32Input.placeholder = "";


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
  var utf8 = convertToUTF8(codepoint).toUpperCase();
  var utf8Steps = generateUTF8ConversionSteps(codepoint);

  // console.log(utf8Steps)
  var utf16 = convertToUTF16(codepoint).toUpperCase();
  var utf16Steps = generateUTF16ConversionSteps(codepoint);

  document.getElementById("utf8").value = utf8;
  document.getElementById("utf16").value = utf16;
  document.getElementById("utf32").value =
    "0x " + codepoint.toString(16).padStart(8, "0");

    document.getElementById("utf8steps").innerHTML = utf8Steps ;
    document.getElementById("utf16steps").innerHTML = utf16Steps ;
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
function generateUTF8ConversionSteps(codepoint) {
  let steps = [];

  if (codepoint <= 0x7f) {
    steps.push("Step 1: This Unicode code point can be represented by a single byte in UTF-8.");
    steps.push(`Step 2: Convert the code point ${codepoint.toString(16).padStart(2, "0").toUpperCase()} to UTF-8 byte: ${codepoint.toString(16).padStart(2, "0").toUpperCase()}.`);
  } else if (codepoint <= 0x7ff) {
    const byte1 = (codepoint >> 6) + 0xc0;
    const byte2 = (codepoint & 0x3f) + 0x80;
    steps.push("Step 1: This Unicode code point requires two bytes for UTF-8 encoding.");
    steps.push(`Step 2: Calculate the first byte: 110xxxxx, where the first 5 bits of the code point are ${byte1.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 3: Calculate the second byte: 10xxxxxx, where the last 6 bits of the code point are ${byte2.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 4: Convert the code point ${codepoint.toString(16).padStart(4, "0").toUpperCase()} to UTF-8: ${byte1.toString(16).padStart(2, "0").toUpperCase()} ${byte2.toString(16).padStart(2, "0").toUpperCase()}.`);
  } else if (codepoint <= 0xffff) {
    const byte1 = (codepoint >> 12) + 0xe0;
    const byte2 = ((codepoint >> 6) & 0x3f) + 0x80;
    const byte3 = (codepoint & 0x3f) + 0x80;
    steps.push("Step 1: This Unicode code point requires three bytes for UTF-8 encoding.");
    steps.push(`Step 2: Calculate the first byte: 1110xxxx, where the first 4 bits of the code point are ${byte1.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 3: Calculate the second byte: 10xxxxxx, where the middle 6 bits of the code point are ${byte2.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 4: Calculate the third byte: 10xxxxxx, where the last 6 bits of the code point are ${byte3.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 5: Convert the code point ${codepoint.toString(16).padStart(6, "0").toUpperCase()} to UTF-8: ${byte1.toString(16).padStart(2, "0").toUpperCase()} ${byte2.toString(16).padStart(2, "0").toUpperCase()} ${byte3.toString(16).padStart(2, "0").toUpperCase()}.`);
  } else {
    const byte1 = (codepoint >> 18) + 0xf0;
    const byte2 = ((codepoint >> 12) & 0x3f) + 0x80;
    const byte3 = ((codepoint >> 6) & 0x3f) + 0x80;
    const byte4 = (codepoint & 0x3f) + 0x80;
    steps.push("Step 1: This Unicode code point requires four bytes for UTF-8 encoding.");
    steps.push(`Step 2: Calculate the first byte: 11110xxx, where the first 3 bits of the code point are ${byte1.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 3: Calculate the second byte: 10xxxxxx, where the second 6 bits of the code point are ${byte2.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 4: Calculate the third byte: 10xxxxxx, where the third 6 bits of the code point are ${byte3.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 5: Calculate the fourth byte: 10xxxxxx, where the last 6 bits of the code point are ${byte4.toString(2).padStart(8, "0")} (binary).`);
    steps.push(`Step 6: Convert the code point ${codepoint.toString(16).padStart(8, "0").toUpperCase()} to UTF-8: ${byte1.toString(16).padStart(2, "0").toUpperCase()} ${byte2.toString(16).padStart(2, "0").toUpperCase()} ${byte3.toString(16).padStart(2, "0").toUpperCase()} ${byte4.toString(16).padStart(2, "0").toUpperCase()}.`);
  }

  return steps.join("<br>");
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

function generateUTF16ConversionSteps(codepoint) {
  let steps = [];

  if (codepoint <= 0xffff) {
    steps.push("Step 1: This Unicode code point can be represented by a single UTF-16 code unit.");
    steps.push(`Step 2:Convert the code point ${codepoint.toString(16).padStart(4, "0").toUpperCase()} to UTF-16: ${"0x" + codepoint.toString(16).padStart(4, "0").toUpperCase()}.`);
  } else {
    const highSurrogate = Math.floor((codepoint - 0x10000) / 0x400) + 0xd800;
    const lowSurrogate = ((codepoint - 0x10000) % 0x400) + 0xdc00;
    steps.push("Step 1:This Unicode code point requires two UTF-16 code units (surrogate pair) for representation.");
    steps.push(`Step 2:Calculate the high surrogate: ${highSurrogate.toString(16).padStart(4, "0").toUpperCase()} (for the range 0xd800 to 0xdbff).`);
    steps.push(`Step 3:Calculate the low surrogate: ${lowSurrogate.toString(16).padStart(4, "0").toUpperCase()} (for the range 0xdc00 to 0xdfff).`);
    steps.push(`Step 4:Combine the high and low surrogates to represent the code point.`);
    steps.push(`Step 5:Convert the code point ${codepoint.toString(16).padStart(6, "0").toUpperCase()} to UTF-16: ${"0x" + highSurrogate.toString(16).padStart(4, "0").toUpperCase()} ${"0x" + lowSurrogate.toString(16).padStart(4, "0").toUpperCase()}.`);
  }

  return steps.join(" <br> ");
}
