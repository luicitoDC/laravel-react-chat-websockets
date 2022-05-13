<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;

class ChatsController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }


    public function fetchMessages()
    {
        return Message::with('user')->get();
    }

    public function sendMessage(Request $request)
    {
        $user = auth()->user();
        $message = $user->messages()->create([
            'message' => $request->input('message')
        ]);
        broadcast(new MessageSent($user, $message))->toOthers();
        return response()->json(['message' => 'message sent!'], 200);
    }
}
