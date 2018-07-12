@extends('layouts.app')

@section('content')
@push('css')
  <link href="{{ url('css/style.css') }}" rel="stylesheet">
@endpush

@push('js')
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>
<script src="{{ url('js/jquery-1.10.1.min.js') }}"></script>
<script type="text/javascript">
 var user_id  = '{{ auth()->user()->id }}';
 var username = '{{ auth()->user()->name }}';
</script>
<script src="{{ url('js/script.js') }}"></script>
@endpush

    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Chat Control</div>

                <div class="card-body">
                    <div id="chat-sidebar">

                        <div id="sidebar-user-box" class="100" >
                        <img src="{{ url('image/user.png') }}" />
                        <span id="slider-username">test User</span>
                        <span class="user_status online">&nbsp;</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection
