# Unicode Converter
**Unicode** is a universal character encoding standard that assigns a unique number to every character and symbol in the world's languages. It ensures that you can get or combine data using any combination of languages, as no other encoding standard covers all languages 1.
In the first section of the program we convert them to various UTF formats. 


**UTF-8** is a variable-length encoding method where each character can be represented using one to four bytes. It is backward compatible with ASCII, making it efficient for English characters.

To convert Unicode to UTF-8 format we...


**UTF-16** uses two or four bytes to represent each character. It is ideal for most Asian text but requires more bytes for English characters 1.

To chuchu.


**UTF-32** is a fixed-length encoding scheme that uses four bytes for each character, providing a direct mapping between code points and bytes.

To convert Unicode to UTF-32, first ensure that the Unicode code point is within the valid range for UTF-32, which is from 0x00000000 to 0x10FFFF. Since UTF-32 uses a fixed-length encoding scheme with four bytes for each character, providing a direct mapping between code points and bytes, the conversion process involves taking the Unicode code point and encoding it as a 32-bit sequence. This is done by converting the code point to its hexadecimal representation and then padding it with zeros to ensure it is 8 hexadecimal digits long, which corresponds to 4 bytes. This method ensures that each Unicode character is represented in UTF-32 as a fixed-length sequence.


# Unicode translator 
In the second section of the program, UTF encoded characters are then translated back into their Unicode equivalent. 
**UTF-32 to Unicode**
To convert UTF-32 to Unicode, first check if the number of hex digits are 8, as UTF-32 uses fixed-length encoding with 32 bits. If the input is valid, directly copy each character from the UTF-32 format to Unicode, as UTF-32 represents each character as a fixed-length 32-bit sequence. This direct mapping allows for a straightforward conversion process, where each 8-digit hexadecimal number corresponds to a unique Unicode code point. This method ensures that the conversion is precise and efficient, making it suitable for applications requiring precise control over character encoding.

| Test with Input Error| Test with correct length |
| ------- | ------- |
|![UTF32_Unicode](UTF32.png)|![UTF32_Unicode](UTF32-error.png)|
