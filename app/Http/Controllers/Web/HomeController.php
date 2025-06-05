<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the welcome page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Welcome');
    }

    /**
     * Display the about us page.
     *
     * @return \Inertia\Response
     */
    public function about()
    {
        return Inertia::render('About');
    }

    /**
     * Display the contact page.
     *
     * @return \Inertia\Response
     */
    public function contact()
    {
        return Inertia::render('Contact');
    }

    /**
     * Display the services page.
     *
     * @return \Inertia\Response
     */
    public function services()
    {
        return Inertia::render('Services');
    }
}
