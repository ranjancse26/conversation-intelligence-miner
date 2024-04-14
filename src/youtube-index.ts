const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversation Intelligence Miner</title>
    <style>
        /* The icon */
        // Reused help icon style from https://codepen.io/hajududat/pen/VqpxgG
        .help-tip{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: auto;
            text-align: center;
            border: 2px solid #444;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            line-height: 42px;
            cursor: default;
        }
        
        .help-tip:before{
            content:'?';
            font-size: 20px;
            font-family: sans-serif;
            font-weight: normal;
            color:#444;
        }
        
        .help-tip:hover p{
            display:block;
            transform-origin: 100% 0%;
            -webkit-animation: fadeIn 0.3s ease;
            animation: fadeIn 0.3s ease;
        }
        
        /* The tooltip */
        .help-tip p {    
            display: none;
            font-family: sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            text-align: center;
            background-color: #FFFFFF;
            padding: 12px 16px;
            width: 178px;
            height: auto;
            position: absolute;
            left: 50%;
            transform: translate(-50%, 5%);
            border-radius: 3px;
        /* 	border: 1px solid #E0E0E0; */
            box-shadow: 0 0px 20px 0 rgba(0,0,0,0.1);
            color: #37393D;
            font-size: 12px;
            line-height: 18px;
            z-index: 99;
        }
        
        .help-tip p a {
            color: #067df7;
            text-decoration: none;
        }
        
        .help-tip p a:hover {
            text-decoration: underline;
        }
        
        /* The pointer of the tooltip */
        .help-tip p:before { 
            position: absolute;
            content: '';
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-bottom-color:#FFFFFF;
            top: -9px;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        /* Prevents the tooltip from being hidden */
        .help-tip p:after {
            width: 10px;
            height: 40px;
            content:'';
            position: absolute;
            top: -40px;
            left: 0;
        }
        
        /* CSS animation */
        @-webkit-keyframes fadeIn {
            0% { opacity:0; }
            100% { opacity:100%; }
        }
        
        @keyframes fadeIn {
            0% { opacity:0; }
            100% { opacity:100%; }
        }
    </style>
    <style>    
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
        }
        #youtubeUrl{
            width:450px;
        }
        .container {
            max-width: 650px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            position: relative;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        label {
            font-size: 16px;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        #MinnerResponse {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
            white-space: pre-wrap;
        }
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            border-radius: 5px;
        }
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .grayButton {
            background-color: gray;
            cursor: default;
        }
        .button-row {
            text-align: center; /* Align buttons in the center */
            margin-bottom: 50px; /* Add some space between rows */
        }
        
        .button-row button {
            display: inline-block; /* Display buttons inline */
            width: 150px; /* Set width for three buttons in a row */
            margin-right: 10px; /* Add some space between buttons */
            vertical-align: top; /* Align buttons to the top of the container */
        }        
        #MinnerResponse {
            width: 580px; /* Specify the width */
            height: 500px; /* Specify the height */
            overflow-y: auto; /* Enable vertical scrolling */
            border: 1px solid #ccc; /* Add border for clarity */
            padding: 10px; /* Add padding for content spacing */
        }
    </style>
</head>
<body>
    <div class="container">
            <svg viewBox="0 0 105 36" role="img" width="105px" height="41px" aria-hidden="true"><path fill="#000" d="M11.679 26.754h2.353v6.423h4.111v2.06H11.68v-8.483zM20.58 31.02v-.024c0-2.436 1.965-4.412 4.584-4.412 2.62 0 4.56 1.951 4.56 4.387v.025c0 2.436-1.965 4.41-4.584 4.41-2.618 0-4.56-1.95-4.56-4.386zm6.743 0v-.024c0-1.223-.885-2.291-2.183-2.291-1.285 0-2.147 1.042-2.147 2.266v.025c0 1.222.886 2.29 2.171 2.29 1.298 0 2.159-1.042 2.159-2.266zM32.604 31.517v-4.763h2.389v4.714c0 1.223.618 1.806 1.564 1.806.946 0 1.564-.557 1.564-1.745v-4.775h2.39v4.7c0 2.74-1.564 3.939-3.978 3.939s-3.93-1.223-3.93-3.878M44.112 26.755h3.274c3.032 0 4.79 1.744 4.79 4.192v.025c0 2.447-1.782 4.265-4.838 4.265h-3.226v-8.483zm3.31 6.397c1.408 0 2.34-.775 2.34-2.146v-.024c0-1.357-.932-2.145-2.34-2.145h-.958v4.316l.959-.001zM55.596 26.754h6.791v2.06h-4.438v1.442h4.014v1.951h-4.014v3.03h-2.353v-8.483zM65.661 26.754h2.353v6.423h4.111v2.06h-6.464v-8.483zM78.273 26.693h2.268l3.614 8.544h-2.522l-.62-1.515H77.74l-.606 1.515h-2.474l3.614-8.544zm2.062 5.2l-.946-2.413-.959 2.412h1.905zM87.186 26.754H91.2c1.298 0 2.195.34 2.765.921.498.485.752 1.14.752 1.976v.024c0 1.296-.693 2.156-1.746 2.605l2.025 2.957H92.28l-1.71-2.57h-1.03v2.57h-2.353v-8.483zm3.905 4.072c.8 0 1.262-.388 1.262-1.006v-.024c0-.667-.486-1.006-1.275-1.006h-1.54v2.038l1.553-.002zM98.112 26.754h6.827v2h-4.498v1.284h4.075v1.854h-4.075v1.346H105v1.999h-6.888v-8.483zM6.528 32.014c-.33.744-1.023 1.272-1.944 1.272-1.286 0-2.171-1.067-2.171-2.29v-.025c0-1.223.86-2.266 2.146-2.266.97 0 1.708.595 2.02 1.406h2.48c-.398-2.02-2.173-3.526-4.475-3.526-2.62 0-4.584 1.977-4.584 4.41v.024c0 2.436 1.94 4.388 4.56 4.388 2.24 0 3.991-1.45 4.453-3.393H6.528z"></path><path d="M89.012 22.355l.257-.887c.306-1.056.192-2.031-.321-2.748-.472-.66-1.259-1.049-2.214-1.094l-18.096-.229a.358.358 0 01-.285-.151.367.367 0 01-.04-.326.481.481 0 01.42-.321l18.263-.232c2.166-.099 4.512-1.856 5.333-3.998L93.37 9.65a.659.659 0 00.028-.36C92.216 3.975 87.468 0 81.792 0c-5.23 0-9.67 3.373-11.263 8.061a5.34 5.34 0 00-3.756-1.039 5.356 5.356 0 00-4.637 6.644c-4.099.12-7.386 3.475-7.386 7.6 0 .368.028.735.082 1.1a.354.354 0 00.348.305l33.408.004h.009a.44.44 0 00.415-.32z" fill="#F6821F"></path><path d="M95.04 9.847c-.167 0-.334.004-.5.013a.28.28 0 00-.079.017.285.285 0 00-.182.192l-.712 2.456c-.305 1.055-.192 2.03.322 2.746.471.661 1.258 1.05 2.213 1.094l3.858.232a.351.351 0 01.275.149.365.365 0 01.041.328.484.484 0 01-.42.32l-4.008.232c-2.176.1-4.521 1.856-5.342 3.998l-.29.756a.212.212 0 00.095.262c.03.017.062.027.096.028h13.802a.366.366 0 00.356-.265 9.846 9.846 0 00.367-2.677c-.001-5.457-4.429-9.88-9.891-9.88z" fill="#FBAD41"></path></svg>
            <h1>Conversation Intelligence Miner</h1>
            <label for="youtubeUrl">Enter YouTube URL:</label><br>
            
            <table>
                <tr>   
                    <td>
                        <input type="text" id="youtubeUrl" 
                            name="youtubeUrl" required 
                            placeholder="https://www.youtube.com/watch?v=v9m9LkHUOFk" /> 
                    </td>
                    <td>
                        <div class="help-tip">
                            <p>Please navigate to Youtube and Copy a Video URL.<br />
                                <a href="https://www.youtube.com/" target="_blank">Youtube.com</a>
                            </p>
                        </div>
                    </td>
                </tr>
            </table>
            
            <!-- First row of buttons -->
            <div class="button-row">
                <button id="submit" name="submit">Get Transcript</button>
                <button id="summary" name="summary">Get Summary</button>
                <button id="keywords" name="keywords">Get Keywords</button>
            </div>

            <div class="button-row">
                <button id="topics" name="topics">Get Topics</button>
                <button id="actionitems" name="actionitems">Get Action Items</button>
                <button id="recommendations" name="recommendations">Get Recommendations</button>
            </div>

            <!-- Third row of buttons -->
            <div class="button-row">
                <button id="trends" name="trends">Get Trends</button>
                <button id="aspects" name="aspects">Get Aspects</button>
                <button id="sentiments" name="sentiments">Get Sentiments</button>
            </div>

            <div class="button-row">
                <button id="banner" name="banner">Get Banner</button>
            </div>

            <!-- Response and other elements -->
            <div id="MinnerResponse"></div>
            <div id="languageTranslationContainer">
                <table>
                    <tr>
                        <td>
                            <p>Source: </p>
                            <select id="languageSelectSource">
                                <option value="english" selected>English</option>
                                <option value="french">French</option>
                                <option value="spanish">Spanish</option> <!-- Specify the selected item using the 'selected' attribute -->
                                <option value="german">German</option>
                            </select>
                        </td>
                        <td>
                            <p>Target: </p>
                            <select id="languageSelectTarget">
                                <option value="english">English</option>
                                <option value="french">French</option>
                                <option value="spanish" selected>Spanish</option> <!-- Specify the selected item using the 'selected' attribute -->
                                <option value="german">German</option>
                            </select>
                        </td>
                        <td>    
                            <button id="translate" name="translate">Translate</button>
                        </td>
                    </tr>                    
                </table>
            </div>
            <div id="transcriptHiddenResult" style='display:none'></div>
            <div class="loading-overlay" style="display: none;">
                <div class="loading-spinner"></div>
            </div>
            <div id="imageContainer"></div>
    </div>

    <script>
        let ws;

        document.querySelector('#youtubeUrl').value = "https://www.youtube.com/watch?v=v9m9LkHUOFk";
        document.querySelector('#MinnerResponse').style.display = 'none';
        document.querySelector('#languageTranslationContainer').style.display = 'none';
        
        disableButtons();

        function disableButtons(){
            document.querySelector('#summary').disabled = true;
            document.querySelector('#keywords').disabled = true;
            document.querySelector('#topics').disabled = true;
            document.querySelector('#actionitems').disabled = true;
            document.querySelector('#recommendations').disabled = true;
            document.querySelector('#trends').disabled = true;
            document.querySelector('#aspects').disabled = true;
            document.querySelector('#banner').disabled = true;
            document.querySelector('#translate').disabled = true;
            document.querySelector('#sentiments').disabled = true;

            document.querySelector('#summary').classList.add('grayButton');
            document.querySelector('#keywords').classList.add('grayButton');
            document.querySelector('#topics').classList.add('grayButton');
            document.querySelector('#actionitems').classList.add('grayButton');
            document.querySelector('#recommendations').classList.add('grayButton');
            document.querySelector('#trends').classList.add('grayButton');
            document.querySelector('#aspects').classList.add('grayButton');
            document.querySelector('#banner').classList.add('grayButton');
            document.querySelector('#translate').classList.add('grayButton');
            document.querySelector('#sentiments').classList.add('grayButton');
        }

        function enableButtons(){
            document.querySelector('#summary').disabled = false;
            document.querySelector('#keywords').disabled = false;
            document.querySelector('#topics').disabled = false;
            document.querySelector('#actionitems').disabled = false;
            document.querySelector('#recommendations').disabled = false;
            document.querySelector('#trends').disabled = false;
            document.querySelector('#aspects').disabled = false;
            document.querySelector('#banner').disabled = false;
            document.querySelector('#translate').disabled = false;
            document.querySelector('#sentiments').disabled = false;

            document.querySelector('#summary').classList.remove('grayButton');
            document.querySelector('#keywords').classList.remove('grayButton');
            document.querySelector('#topics').classList.remove('grayButton');
            document.querySelector('#actionitems').classList.remove('grayButton');
            document.querySelector('#recommendations').classList.remove('grayButton');
            document.querySelector('#trends').classList.remove('grayButton');
            document.querySelector('#aspects').classList.remove('grayButton');
            document.querySelector('#banner').classList.remove('grayButton');
            document.querySelector('#translate').classList.remove('grayButton');
            document.querySelector('#sentiments').classList.remove('grayButton');
        }

        async function websocket(url) {
            ws = new WebSocket(url);

            if (!ws) {
                throw new Error("Server didn't accept WebSocket connection.");
            }

            ws.addEventListener("open", () => {
                console.log('Opened WebSocket');
                hideLoading();
            });

            ws.addEventListener("message", ({ data }) => {
                document.querySelector('#languageTranslationContainer').style.display = 'none';
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                if(parsedData.type === "TRANSLATEDCONTENT"){
                    document.querySelector('#languageTranslationContainer').style.display = 'block';
                    document.querySelector("#MinnerResponse").textContent = parsedData.content;
                    document.querySelector('#MinnerResponse').style.display = 'block';
                }
                if(parsedData.type === "TRANSCRIPT"){
                    document.querySelector('#languageTranslationContainer').style.display = 'block';
                    document.querySelector("#MinnerResponse").textContent = parsedData.content;
                    document.querySelector("#transcriptHiddenResult").textContent = parsedData.content;
                    document.querySelector('#MinnerResponse').style.display = 'block';
                }else if(parsedData.type === "BANNER"){
                    // Create a Blob from the Uint8Array
                    document.querySelector("#MinnerResponse").textContent = parsedData.summary;
                    document.querySelector('#MinnerResponse').style.display = 'block';
                    displayImage(parsedData.content);
                }
                else{
                    document.querySelector("#MinnerResponse").textContent = parsedData.content;
                    document.querySelector('#MinnerResponse').style.display = 'block';
                }
                
                hideLoading();
            });
        }

        function displayImage(byteArray) {
            const uint8Array = new Uint8Array(byteArray);

            // Convert the Uint8Array to a Blob
            const blob = new Blob([uint8Array], { type: 'image/png' });

            // Create a FileReader to read the Blob as a data URL
            const reader = new FileReader();

            reader.onload = function() {
                const imageUrl = reader.result;

                // Create an <img> element and set its src attribute to the data URL
                const img = document.createElement('img');
                img.src = imageUrl;

                // Set style attributes for height and width
                img.style.height = '500px';
                img.style.width = '600px';

                // Append the <img> element to the imageContainer
                document.getElementById('imageContainer').appendChild(img);
            };

            // Read the Blob as a data URL
            reader.readAsDataURL(blob);
        }

        const url = new URL(window.location);
        url.protocol = location.protocol.replace("http", "ws");
        url.pathname = "/ws";

        function showLoading() {
            document.querySelector('.loading-overlay').style.display = 'flex';
        }

        function hideLoading() {            
            document.querySelector('.loading-overlay').style.display = 'none';
        }

        websocket(url);

        document.querySelector("#submit").addEventListener("click", async () => {
            disableButtons();
            document.querySelector('#MinnerResponse').style.display = 'none';
            const url = document.querySelector('#youtubeUrl').value;
            console.log(url);
            showLoading();
            var data = {
                'content': '',
                'url': url,
                'command': 'GETTRANSCRIPT'
            };
            ws.send(JSON.stringify(data));
            enableButtons();
        });

        document.querySelector("#summary").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';
            
            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETSUMMARY'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#keywords").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETKEYWORDS'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#topics").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETTOPICS'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#actionitems").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETACTIONITEMS'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#recommendations").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETRECOMMENDATIONS'
            };
            ws.send(JSON.stringify(data));
        }); 

        document.querySelector("#sentiments").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETSENTIMENTS'
            };
            ws.send(JSON.stringify(data));
        }); 
        
        document.querySelector("#trends").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETTRENDS'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#aspects").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETASPECTS'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#banner").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'none';

            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var data = {
                'content': transcript,
                'url': '',
                'command': 'GETBANNER'
            };
            ws.send(JSON.stringify(data));
        });

        document.querySelector("#translate").addEventListener("click", async () => {
            document.querySelector('#MinnerResponse').style.display = 'none';
            document.querySelector('#languageTranslationContainer').style.display = 'block';
            showLoading();
            var transcript = document.querySelector('#transcriptHiddenResult').textContent;
            var source = document.querySelector('#languageSelectSource').value;
            var target = document.querySelector('#languageSelectTarget').value;
            var data = {
                'content': transcript,
                'url': '',
                'source': source,
                'target': target,
                'command': 'GETTRANSLATEDCONTENT'
            };
            ws.send(JSON.stringify(data));
        });

        window.addEventListener('beforeunload', function(event) {
            // Close WebSocket connection
            ws.close();
        });
    </script>
</body>
</html>
`;

export default () => {
    return new Response(html, {
        headers: {
            'Content-type': 'text/html; charset=utf-8',
        },
    });
};