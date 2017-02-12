import React from 'react'
import css from './faq.scss'

class Faq extends React.Component {
  render() {
    return <div className={css.faq}>
      <header id="return" >
        <h2><a href="#start">Tutorial</a> and <a href="#FAQ">FAQ</a></h2>
      </header>
      <section id="start">
        <h3>Quick Tutorial Start Here</h3>
        <p>Join a <a href="#groupChat">group chat</a> or do a <a href="#exchange">language exchange</a> with a friend and learn to use these following tools to help you learn a language.</p>
        <h3>I. Correct and Save Messages:</h3>
        <ul>
          <li>
            <h3 id="correct">Correct Messages:</h3>
            <ul>
              <p>Click on the message:</p>
              <img src="/faq/clickCorrect.gif" alt="Chart" height="90px"/>

              <p>Type in the correction or question and press "Send":</p>
              <img src="/faq/typeCorrection.gif" alt="Chart" height="68px"/>

              <p>This will also make a pink highlight on the message and a sound to notify you that there is a correction. You can now see a corrected message or question:</p>
              <img src="/faq/correctionOpen.gif" alt="Chart" height="130px"/>

              <p> Click the message again to hide the submessage. We recommend that you hide all your messages once you have seen the correction:</p>
              <img src="/faq/closeCorrection.gif" alt="Chart" height="48px"/>
            </ul>
          </li>
          <li>
            <h3 id="save">Save a message:</h3>
            <ul>
              <p>Click on the "<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" className="message_tagSave_3_870" ><g><path d="m25.5 6.3c5.4 0 9.5 3.3 9.5 9 0 2.4-1 5.6-3.2 8.2s-3.5 4.1-7.8 6.9-6.5 3.4-6.5 3.4-2.2-0.6-6.5-3.4-5.6-4.2-7.8-6.9-3.2-5.8-3.2-8.2c0-5.7 4.1-9 9.5-9 3 0 6.4 1.4 8 4.1 1.6-2.7 5-4.1 8-4.1z m5.4 16.4c0.9-1.1 1.7-2.4 2.1-3.8 0.5-1.2 0.7-2.4 0.7-3.6 0-2.3-0.7-4.4-2.2-5.8-0.7-0.6-1.6-1.1-2.6-1.5-1-0.3-2.2-0.5-3.4-0.5-2.9 0-5.7 1.4-6.9 3.5l-1.1 1.8-1.1-1.8c-1.2-2.1-4-3.5-6.9-3.5-1.2 0-2.4 0.2-3.4 0.5-1 0.4-1.9 0.9-2.6 1.5-1.5 1.4-2.2 3.5-2.2 5.8 0 1.2 0.2 2.4 0.7 3.6 0.4 1.4 1.2 2.7 2.1 3.8 2.2 2.5 3.3 3.9 7.6 6.7 3.1 2.1 5.1 2.8 5.8 3 0.7-0.2 2.7-0.9 5.8-3 4.3-2.8 5.5-4.2 7.6-6.7z"></path></g></svg>" to the right of each message:</p>
              <p><img src="/faq/save.gif" alt="Chart" height="49px"/></p>
              <p>This will keep the message under the "Study Guide" section in the Menu to help you study the corrections. We recommend that you save the corrections.</p>
            </ul>
          </li>
        </ul>
        <h3>II. Use Highlight, and Translation options under the "<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" className="menu_iconMore_1uel4" ><g><path d="m10.6 16.9c1.7 0 3.2 1.4 3.2 3.1s-1.5 3.1-3.2 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1z m18.8 0c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1z m-9.4 0c1.7 0 3.1 1.4 3.1 3.1s-1.4 3.1-3.1 3.1-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1z"></path></g></svg>" to the right of each message:</h3>
        <ul>
          <img src="/faq/options.gif" alt="Chart" height="150px"/>
          <li>
            <h3 id="translate">Translate a message:</h3>
            <p>Click on the "<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" ><g><path d="m9.4 31.3c-3.2 0-5.9-2.5-5.9-5.6v-16.3c0-3.1 2.7-5.6 5.9-5.6h20.7c3.2 0 5.9 2.5 5.9 5.6v16.3c0 3.1-2.7 5.6-5.9 5.6h-0.3v5s-6.2-4.3-6.8-4.7-0.5-0.3-1.6-0.3h-12z m17.9-16.3c-1.5 0-2.5 1.1-2.5 2.5s1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z m-7.5 0c-1.5 0-2.5 1.1-2.5 2.5s1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z m-7.5 0c-1.5 0-2.5 1.1-2.5 2.5s1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z"></path></g></svg> Translate: en" this will translate the message to English.</p>
            <p>Note: Make sure that you have chosen the proper language you want to learn and you can speak under "My Account", or the translator won't work.</p>
          </li>
          <li>
            <h3 id="highlights">Use Highlights:</h3>
            <ul>
              <li>
                <h4>Click on "<svg fill="#98fb98" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" className="menu_tagHowSay_3DFLo" ><g><path d="m34.1 5c0.5 0 0.9 0.4 0.9 0.9v28.2c0 0.5-0.4 0.9-0.9 0.9h-28.2c-0.5 0-0.9-0.4-0.9-0.9v-28.2c0-0.5 0.4-0.9 0.9-0.9h28.2z"></path></g></svg> How do I say...?"</h4>
                <p>Use this if you are not sure how to say something, to get help on how to say that message:</p>
                <img src="/faq/greenTag.gif" alt="Chart" height="46px"/>
              </li>
              <li>
                <h4>Click on "<svg fill="#ffeb3b" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" className="menu_tagHowSay_3DFLo" ><g><path d="m34.1 5c0.5 0 0.9 0.4 0.9 0.9v28.2c0 0.5-0.4 0.9-0.9 0.9h-28.2c-0.5 0-0.9-0.4-0.9-0.9v-28.2c0-0.5 0.4-0.9 0.9-0.9h28.2z"></path></g></svg> Is this correct?"</h4>
                <p>Use this if you want someone to correct your message or need to be sure it's correct:</p>
                <img src="/faq/yellowTag.gif" alt="Chart" height="48px"/>
              </li>
              <li>
                <h4>Click on "<svg fill="#81cfe0" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" className="menu_tagHowSay_3DFLo" ><g><path d="m34.1 5c0.5 0 0.9 0.4 0.9 0.9v28.2c0 0.5-0.4 0.9-0.9 0.9h-28.2c-0.5 0-0.9-0.4-0.9-0.9v-28.2c0-0.5 0.4-0.9 0.9-0.9h28.2z"></path></g></svg> What does this mean?"</h4>
                <p>Use this if you don't understand a message to get more help understanding it from a teacher:</p>
                <img src="/faq/blueTag.gif" alt="Chart" height="49px"/>
              </li>
              <li>
                <h4>
                  NOTE: When someone helps you, the message will turn pink and make a sound to notify you.
                  Click on the message to see the correction. Here is an exacmple of the "
                  <svg fill="#ffeb3b" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" className="menu_tagHowSay_3DFLo" >
                    <g>
                      <path d="m34.1 5c0.5 0 0.9 0.4 0.9 0.9v28.2c0 0.5-0.4 0.9-0.9 0.9h-28.2c-0.5 0-0.9-0.4-0.9-0.9v-28.2c0-0.5 0.4-0.9 0.9-0.9h28.2z"></path>
                    </g>
                  </svg>
                  Is this correct?" :
                </h4>
              </li>
              <p><img src="/faq/sampleTag.gif" alt="Chart" height="150px"/></p>
              <p>*Ema helped correct Gilbert's message. Use these options to improve your English.</p>
            </ul>
          </li>
        </ul>
        <h3>III. Use the "Study Guide" Section in the "Menu" to Study:</h3>
        <ul>
          <li><p>Click on "Study Guide" in "Menu". You have access to all the saved corrected messages. Now you can study and improve!</p></li>
        </ul>
        <h3>Tutorial Finished! Thank you for your patience!</h3>
        <h4>Go to <a href="#FAQ">FAQ</a> for futher details. If you can't find an answer and you really want an answer, please email us at support@matchlang.com</h4>
      </section>
      <section id="FAQ" className="cd-faq">
        <h2>Frequently Asked Questions:</h2>
        <a href="#return">Return To Tutorial</a>
        <ul className="cd-faq-categories">
          <li><a className="selected" href="#teacherMode">Teacher Mode or Student Mode?</a></li>
          <li><a href="#groupChat">Join a group chat?</a></li>
          <li><a href="#exchange">Language Exchange with a friend?</a></li>
          <li><a href="#review">Review corrections not showing?</a></li>
          <li><a href="#translator">Translate button missing?</a></li>
          <li><a href="#loginIssues">Can't Login or Forgot Password?</a></li>
          <li><a href="#phoneApp">Is a Phone App available?</a></li>
          <li><a href="#correct">How to Correct Messages?</a></li>
          <li><a href="#highlights">How to use highlighting options?</a></li>
        </ul>

        <div className="cd-faq-items">
          <ul id="teacherMode" className="cd-faq-group">
            <li className="cd-faq-title"><h3>"Teacher Mode" or "Student Mode"?</h3></li>
            <img src="/faq/teacherButton.gif" alt="Chart" height="158"/>
            <div className="cd-faq-content">
              <p>Look for the "Student Mode" button under "credits:0". Click on the button to go into "Teacher Mode". For now it just shows you teachers if you're in "Student Mode" and students if you're in "Teacher Mode".</p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>
          <ul id="groupChat" className="cd-faq-group">
            <li className="cd-faq-title"><h3>Join a group chat?</h3></li>
            <div className="cd-faq-content">
              <p>Under "Menu" click on "Group Chat". Look for a group chat you like and "Join chat!" If you don't see one you like you can create your own group chat in "Create Group" under "Group Chat". Make a name for your group click "create".</p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>

          <ul id="exchange" className="cd-faq-group">
            <li className="cd-faq-title"><h3>Language exchange with a friend?</h3></li>
            <div className="cd-faq-content">
              <p>If you want to do a language exchange with 1 person and not a group. You need to be in <a href="#teacherMode">"Teacher Mode"</a> and your friend needs to be in "Student Mode" and you find each other by clicking "Search Teachers" or "Search Students" and click on "Message Me"</p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>
          <ul id="review" className="cd-faq-group">
            <li className="cd-faq-title"><h3>Review corrections not showing?</h3></li>
            <div className="cd-faq-content">
              <p>Don't forget to save the message or it won't go to the review section. <a href="#save">Click here to learn how to save.</a></p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>
          <ul id="translator" className="cd-faq-group">
            <li className="cd-faq-title"><h3>Translate button missing?</h3></li>
            <div className="cd-faq-content">
              <p>Set the language you want to learn under "My Account". For further message translating information <a href="#translate">Click here.</a></p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>
          <ul id="loginIssues" className="cd-faq-group">
            <li className="cd-faq-title"><h3>Can't Login or Forgot Password?</h3></li>
            <div className="cd-faq-content">
              <p>Please create a new account if you can't remember your password or have any issues logging in.</p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>
          <ul id="phoneApp" className="cd-faq-group">
            <li className="cd-faq-title"><h3>Is a Phone App available?</h3></li>
            <div className="cd-faq-content">
              <p>We are currently developing our phone app. Our website is mobile friendly and can be used with your phone's internet browser. Feel free to tell us what you want to see in the phone app at support@matchlang.com</p>
            </div>
            <a className="" href="#return">Return to Tutorial</a> <a href="#FAQ">Return to FAQ</a>
          </ul>
        </div>
      </section>
    </div>
  }
}

export default Faq