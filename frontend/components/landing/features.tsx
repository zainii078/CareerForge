"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  LayoutTemplate,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description:
      "Get intelligent suggestions to improve your resume content. Our AI analyzes successful resumes to provide actionable recommendations.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description:
      "Beat applicant tracking systems with keyword optimization. Our scanner analyzes your resume against job descriptions for maximum compatibility.",
    gradient: "from-teal-500 to-emerald-400",
  },
  {
    icon: LayoutTemplate,
    title: "Professional Templates",
    description:
      "Choose from 20+ ATS-friendly templates designed by hiring experts. Each template is optimized for different industries and roles.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track your application success rate, interview callbacks, and job matches. Data-driven insights to improve your search strategy.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description:
      "Get matched with relevant job opportunities based on your skills and experience. Our algorithm finds roles that fit your profile.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is encrypted and never shared. We use enterprise-grade security to protect your personal and professional information.",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Create resumes in multiple languages. Perfect for international job seekers and global opportunities.",
    gradient: "from-cyan-500 to-blue-400",
  },
  {
    icon: Brain,
    title: "Smart Interviews",
    description:
      "Practice with AI-powered interview preparation. Get personalized questions and feedback based on your target role.",
    gradient: "from-amber-500 to-orange-400",
  },
];

export function Features() {
  return (
    <section id="features-section" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              land your dream job
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our comprehensive suite of tools helps you create, optimize, and track
            your job applications with unprecedented precision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
