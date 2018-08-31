var ws = new WebSocket('ws://localhost:52000');
var msgContainer = document.getElementById('msg-container');
var counterContainer = document.getElementById('counter');
var makeLightning = false;
var flashCnt = 0;
var hashTagCnt = 0;
var totalHashHistory = Math.max(1000000000, Math.floor(Math.random() * 100000000000)); //billions

// Set up audio
var path = '../audio/';
var audioIsPlaying = false;
var spk;
var audioFiles = [
    'a_net_worth.mp3',
    'african_american_youth.mp3',
    'again.mp3',
    'alcohol.mp3',
    'also.mp3',
    'an_election.mp3',
    'and_it_not_just_mexicans.mp3',
    'and_well_be_announcing_in_not_so_distant_future.mp3',
    'and.mp3',
    'believe_it_or_not.mp3',
    'better_than_ever_before.mp3',
    'border_guards.mp3',
    'but.mp3',
    'can_you_believe_this.mp3',
    'china.mp3',
    'corportate_inversion_is_a_huge_problem.mp3',
    'doing_the_right_thing.mp3',
    'drugs.mp3',
    'every_single.mp3',
    'fifteen_million_dollars.mp3',
    'fifty_five_percent.mp3',
    'four_page_plan.mp3',
    'from_the_middle_east.mp3',
    'general_motors.mp3',
    'hes_got_tremendous_liability.mp3',
    'hey.mp3',
    'hillary_clinton.mp3',
    'hillary_failed.mp3',
    'hotel.mp3',
    'i_actually_enjoy_that.mp3',
    'i_can_make_a_big_difference.mp3',
    'i_had_no_idea.mp3',
    'i_have_the_best_courses_in_the_world.mp3',
    'i_like_china.mp3',
    'i_think_i_am_a_nice_person.mp3',
    'i_think_its_running_a_business.mp3',
    'i_think_ive_been_showing_a_lot_of_meat.mp3',
    'i_think.mp3',
    'i_want_to_make_our_country_great_again.mp3',
    'i_want_to_make_the_country_great_again.mp3',
    'i_want_to.mp3',
    'i_was_exhilarated.mp3',
    'im_about_jobs.mp3',
    'im_about_the_military.mp3',
    'im_enjoying_it.mp3',
    'im_going_to_do_that.mp3',
    'im_in_competition_with_them.mp3',
    'im_really_rich.mp3',
    'im_talking_in_real_life.mp3',
    'incompetent_politicians.mp3',
    'islamic_terrorism.mp3',
    'it_only_makes_common_sense.mp3',
    'its_a_five_year_deal.mp3',
    'its_ok.mp3',
    'japan.mp3',
    'john_mccain_failed.mp3',
    'john_mccain.mp3',
    'large.mp3',
    'lots_of_problems.mp3',
    'maybe_winning.mp3',
    'mexico.mp3',
    'my_other_life.mp3',
    'ninety_three_million_people.mp3',
    'nothing_but_problem.mp3',
    'obama.mp3',
    'obamacare.mp3',
    'our_country_is_broken.mp3',
    'people_are_tired_of_incompetence.mp3',
    'people_that_know_me_like_me.mp3',
    'phenomenal.mp3',
    'poor_people.mp3',
    'president.mp3',
    'probably.mp3',
    'rapists.mp3',
    'rich.mp3',
    'running_my_company.mp3',
    'so_amazing.mp3',
    'somebody_from_china.mp3',
    'south_and_latin_america.mp3',
    'terrorists_coming_from_the_middle_east.mp3',
    'thats_fine.mp3',
    'the_white_house.mp3',
    'they_have_built_a_hotel.mp3',
    'theyre_bringing_drugs.mp3',
    'this_country_has_so_much_potential.mp3',
    'tremendous_amounts_of_dollars.mp3',
    'trying_to_kill_us.mp3',
    'united_states_is_run_by_stupid_people.mp3',
    'we_do_have_killers.mp3',
    'we_dont_know_who_these_people_are.mp3',
    'we_have_losers.mp3',
    'we_have_to_keep_going.mp3',
    'we_have_to_unleash_it.mp3',
    'we_need_jobs.mp3',
    'we_still_have_a_long_way_to_go.mp3',
    'well_over_ten_billion_dollars.mp3',
    'well.mp3',
    'were_going_to_do_a_fantastic_job.mp3',
    'whats_going_on.mp3',
    'when_he_put_that_up_he_than_took_that_down.mp3',
    'without_question.mp3',
    'womans_health_issues.mp3',
    'you_know_were_going_to_be_suing_them_anyway.mp3'
];
var cx = new window.AudioContext() || new window.webkitAudioContext();
var buffers = new BufferLoader(cx, audioFiles, buffersLoaded, path);
buffers.load();

msgContainer.innerHTML = `<div id="loading-container">It's coming...</div>`;

// Open websocket
ws.onopen = function () {
    console.log('websocket is connected ...');
    ws.send('connected');
}

function buffersLoaded(buffers) {

    // event emmited when receiving message 
    ws.onmessage = function (ev) {
        var data = JSON.parse(ev.data);
        var template = `<div class="tweet-container">
            <div class="hashtag">${data.tag}</div>    
            <div class="user">${data.user}</div>
            <div class="tweet">${data.tweet}</div>
        </div>`;
        
        var cntTemplate = `${(totalHashHistory + hashTagCnt).toLocaleString()} #fakenews tweets and counting*`;

        counterContainer.innerHTML = cntTemplate;
        msgContainer.innerHTML = template;
        makeLightning = true;
        hashTagCnt++;

        if (!audioIsPlaying) {
            audioIsPlaying = true;    
            var buffer = buffers[Math.floor(Math.random() * buffers.length)];
            trumpSpeak(buffer);
        }   

    }

    ws.onclose = function() {
        console.log('connection closed');
    }

    ws.onerror = function() {
        console.log('there was an error');
    }

}

function trumpSpeak(buffer) {
    var bufSrc = cx.createBufferSource();
    bufSrc.buffer = buffer;
    bufSrc.loop = false;
    bufSrc.connect(cx.destination);
    bufSrc.start(0);
    bufSrc.onended = function() {
        audioIsPlaying = false;
        bufSrc.disconnect();
    };
}
