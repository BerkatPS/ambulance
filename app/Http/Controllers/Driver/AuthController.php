<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show driver login form
     *
     * @return \Inertia\Response
     */
    public function showLoginForm()
    {
        return Inertia::render('Driver/Auth/Login');
    }

    /**
     * Handle driver login
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $login = $request->input('login');
        $loginField = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'employee_id';

        $credentials = [
            $loginField => $login,
            'password' => $request->input('password'),
        ];

        if ($request->filled('remember')) {
            $remember = true;
        } else {
            $remember = false;
        }

        if (Auth::guard('driver')->attempt($credentials, $remember)) {
            $request->session()->regenerate();

            return redirect()->intended(route('driver.dashboard'));
        }

        return back()->withErrors([
            $loginField => 'The provided credentials do not match our records.',
        ])->withInput($request->except('password'));
    }

    /**
     * Handle driver logout
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::guard('driver')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('driver.login');
    }
}
