<?php

namespace App\Http\Controllers;

use Auth;
use App\Models\User;

class UsersController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }


    public function get()
    {
      $user = User::all();
      return response()->json($user, 200);
    }
}
