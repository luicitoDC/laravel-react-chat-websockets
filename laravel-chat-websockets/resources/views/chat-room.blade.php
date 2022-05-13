<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="https://cdn.tailwindcss.com"></script>
    <script src="{{ asset('js/app.js') }}" defer></script>
		<meta name="csrf-token" content="{{ csrf_token() }}">
	</head>
	<body>
    <div id="chat-room"></div>
	</body>
</html>