const Message = require('../models/Message');
const Application = require('../models/Application');
const Notification = require('../models/Notification'); // We can reuse our notification system!

// View chat for a specific application
exports.getChat = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.session.user.id;

        // Fetch application and populate the job and users
        const application = await Application.findById(applicationId)
            .populate('job')
            .populate('applicant', 'name')
            .populate('recruiter', 'name');

        if (!application) {
            return res.status(404).send("Application not found");
        }

        // Security: Ensure only the specific applicant or recruiter can view this chat
        if (application.applicant._id.toString() !== userId && application.recruiter._id.toString() !== userId) {
            return res.status(403).send("Unauthorized to view this chat");
        }

        // Fetch chat history, sorted from oldest to newest (so new messages appear at the bottom)
        const messages = await Message.find({ applicationId }).sort({ createdAt: 1 });

        // Identify the "other user" so we can show their name at the top of the chat
        const otherUser = application.applicant._id.toString() === userId ? application.recruiter : application.applicant;

        res.render('chat', { application, messages, currentUser: req.session.user, otherUser });
    } catch (error) {
        console.error("Error loading chat:", error);
        res.status(500).send("Server error loading chat");
    }
};

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { text } = req.body;
        const userId = req.session.user.id;

        const application = await Application.findById(applicationId).populate('job', 'title');

        if (!application) {
            return res.status(404).send("Application not found");
        }

        // 🔒 SECURITY CHECK: Ensure user is either the applicant or the recruiter
        if (application.applicant.toString() !== userId && application.recruiter.toString() !== userId) {
            return res.status(403).send("Unauthorized to send messages in this chat");
        }

        // Determine who the receiver is
        const receiverId = application.applicant.toString() === userId ? application.recruiter : application.applicant;

        // Save the new message
        const newMessage = new Message({
            applicationId,
            sender: userId,
            receiver: receiverId,
            text
        });
        await newMessage.save();

        // Trigger a notification to the other person!
        await Notification.create({
            recipient: receiverId,
            sender: userId,
            message: `New message from ${req.session.user.name} regarding "${application.job.title}"`,
            link: `/applications/${applicationId}/chat`
        });

        // Refresh the chat page to show the new message
        res.redirect(`/applications/${applicationId}/chat`);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).send("Server error sending message");
    }
};