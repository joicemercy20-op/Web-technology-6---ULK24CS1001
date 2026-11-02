TASKFLOW — JavaScript Functions Task Tracker
============================================

Files:
- index.html : page structure
- style.css  : responsive design and styling
- app.js     : task state and JavaScript functions

Run in Visual Studio Code:
1. Extract the ZIP file.
2. Open the extracted folder in VS Code (File > Open Folder).
3. Open index.html.
4. Recommended: install the "Live Server" extension.
5. Right-click index.html > Open with Live Server.

Features implemented in line with the supplied PPT:
- createTask(), addTask(), toggleTask(), deleteTask()
- getVisible(), countOpen(), taskItem(), renderTasks()
- saveAndRender() helper
- handleSubmit(event) and event listener callback connection
- map(), filter(), forEach()
- task persistence using localStorage
- filters for All, In progress, Completed
- completion progress indicator, counts, clear completed
- responsive layout for desktop and mobile

Note: Google Fonts are loaded from the internet. The app itself works without them,
using fallback fonts. Tasks are stored in this browser's localStorage.
