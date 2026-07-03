<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImportSourceRequest;
use App\Http\Requests\UpdateImportSourceRequest;
use App\Models\ImportSource;

class ImportSourceController extends Controller
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
    public function store(StoreImportSourceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ImportSource $importSource)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImportSourceRequest $request, ImportSource $importSource)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ImportSource $importSource)
    {
        //
    }
}
