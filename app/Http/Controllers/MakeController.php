<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMakeRequest;
use App\Http\Requests\UpdateMakeRequest;
use App\Models\Make;

class MakeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMakeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Make $make)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMakeRequest $request, Make $make)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Make $make)
    {
        //
    }
}
